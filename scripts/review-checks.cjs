// Browser checks for the review findings R9-R12 (form result, CRM jobs,
// CRM outage, disclaimer focus). Not part of the build.
//
//   npm run build && npx vite preview --port 4302 &
//   node scripts/review-checks.cjs http://localhost:4302
//
// Needs Playwright (`npx playwright install chromium` once, if it is not
// already on the machine). The form service and the CRM are stubbed with
// Playwright routes: nothing is sent anywhere.
const { chromium } = require('playwright')
const BASE = process.argv[2]
const CMS = 'https://crm.rsa-india.in/api/public/website/content'

const content = (extra = {}) => ({
  complianceReviewedAt: null,
  compliance: { overrides: [], extra: [] },
  posts: [{ id: 'p1', title: 'Only in the CRM', slug: 'only-in-crm', summary: 'x', body: '<p>Body from the CRM.</p>', format: 'html', date: '2026-11-01', attachments: [], inline: [], cover: null, publishedAt: 1 }],
  faqs: [],
  process: [],
  careers: [],
  ...extra,
})

async function page(browser, { agreed = true } = {}) {
  const ctx = await browser.newContext()
  if (agreed) await ctx.addInitScript(() => sessionStorage.setItem('disclaimer-agreed', 'true'))
  await ctx.route('**/*posthog*/**', (r) => r.abort())
  return { ctx, page: await ctx.newPage() }
}

const results = []
async function check(name, fn) {
  try {
    await fn()
    results.push(`PASS  ${name}`)
  } catch (e) {
    results.push(`FAIL  ${name}\n        ${String(e.message).split('\n')[0]}`)
  }
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

;(async () => {
  const browser = await chromium.launch()

  await check('R9  a refused submission does not say thanks, keeps what was typed, and offers email/phone', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) => r.fulfill({ json: content() }))
    await ctx.route('https://formsubmit.co/**', (r) => r.fulfill({ status: 200, json: { success: 'false', message: 'Form should POST' } }))
    await p.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
    const form = p.locator('form').first()
    for (const input of await form.locator('input:not([type=hidden]):not([name=_honey]), textarea').all()) {
      const type = await input.getAttribute('type')
      if (await input.isVisible()) await input.fill(type === 'email' ? 'a@example.com' : type === 'tel' ? '9999999999' : 'Test enquiry')
    }
    for (const sel of await form.locator('select').all()) await sel.selectOption({ index: 1 })
    await form.locator('button[type=submit]').click()
    await p.waitForTimeout(800)
    expect((await p.getByText(/thanks for submitting/i).count()) === 0, 'showed "Thanks for submitting!"')
    expect((await p.getByRole('alert').count()) > 0, 'no error shown')
    expect((await form.locator('textarea').inputValue()) === 'Test enquiry', 'typed message was lost')
    expect((await p.getByRole('alert').getByRole('link', { name: /\+91/ }).count()) > 0, 'no phone fallback in the error')
    await ctx.close()
  })

  await check('R9  an accepted submission still says thanks', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) => r.fulfill({ json: content() }))
    await ctx.route('https://formsubmit.co/**', (r) => r.fulfill({ status: 200, json: { success: 'true', message: 'The form was submitted successfully.' } }))
    await p.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
    const form = p.locator('form').first()
    for (const input of await form.locator('input:not([type=hidden]):not([name=_honey]), textarea').all()) {
      const type = await input.getAttribute('type')
      if (await input.isVisible()) await input.fill(type === 'email' ? 'a@example.com' : type === 'tel' ? '9999999999' : 'Test enquiry')
    }
    for (const sel of await form.locator('select').all()) await sel.selectOption({ index: 1 })
    await form.locator('button[type=submit]').click()
    await p.waitForTimeout(800)
    expect((await p.getByText(/thanks for submitting/i).count()) > 0, 'no thanks on success')
    await ctx.close()
  })

  await check('R10 a job published in the CRM can be chosen; a closed one cannot', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) =>
      r.fulfill({
        json: content({
          careers: [
            { id: 'c1', title: 'Review Data Analyst', summary: 'x', open: true, attachments: [] },
            { id: 'c2', title: 'Closed Role', open: false, attachments: [] },
          ],
        }),
      }),
    )
    await p.goto(`${BASE}/careers`, { waitUntil: 'networkidle' })
    const options = await p.locator('#position option').allTextContents()
    expect(options.includes('Review Data Analyst'), `options were: ${options.join(' | ')}`)
    expect(!options.includes('Closed Role'), 'a closed job was offered')
    await ctx.close()
  })

  await check('R11 a CRM outage on an article says "temporarily unavailable" with Retry, and Retry loads it', async () => {
    const { ctx, page: p } = await page(browser)
    let up = false
    await ctx.route(CMS, (r) => (up ? r.fulfill({ json: content() }) : r.abort()))
    await p.goto(`${BASE}/insights/only-in-crm`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(500)
    expect((await p.getByText(/page not found/i).count()) === 0, 'showed "Page not found" during an outage')
    expect((await p.getByText(/temporarily unavailable/i).count()) > 0, 'no temporary-unavailable message')
    up = true
    await p.getByRole('button', { name: /try again/i }).click()
    await p.waitForTimeout(800)
    expect((await p.getByText('Body from the CRM.').count()) > 0, 'Retry did not load the article')
    await ctx.close()
  })

  await check('R11 moving to another page after an outage asks the CRM again', async () => {
    const { ctx, page: p } = await page(browser)
    let calls = 0
    await ctx.route(CMS, (r) => {
      calls++
      return calls === 1 ? r.abort() : r.fulfill({ json: content() })
    })
    await p.goto(`${BASE}/insights`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(300)
    await p.evaluate(() => {
      history.pushState({}, '', '/insights/only-in-crm')
      dispatchEvent(new PopStateEvent('popstate'))
    })
    await p.waitForTimeout(800)
    expect(calls >= 2, `CRM asked ${calls} time(s)`)
    expect((await p.getByText('Body from the CRM.').count()) > 0, 'article not shown after recovery')
    await ctx.close()
  })

  await check('R11 the compliance calendar says when extensions could not be loaded', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) => r.abort())
    await p.goto(`${BASE}/compliance-calendar`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(400)
    expect((await p.getByText(/extensions could not be loaded/i).count()) > 0, 'no notice about missing extensions')
    await ctx.close()
  })

  await check('R12 Tab and Shift+Tab stay inside the disclaimer', async () => {
    const { ctx, page: p } = await page(browser, { agreed: false })
    await ctx.route(CMS, (r) => r.fulfill({ json: content() }))
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    const inside = () => p.evaluate(() => !!document.activeElement?.closest('[aria-labelledby="disclaimer-title"]'))
    expect(await inside(), 'focus did not start inside the disclaimer')
    for (let i = 0; i < 6; i++) {
      await p.keyboard.press('Tab')
      expect(await inside(), `Tab ${i + 1} left the disclaimer for ${await p.evaluate(() => document.activeElement?.outerHTML.slice(0, 80))}`)
    }
    for (let i = 0; i < 6; i++) {
      await p.keyboard.press('Shift+Tab')
      expect(await inside(), `Shift+Tab ${i + 1} left the disclaimer`)
    }
    await p.keyboard.press('Escape')
    expect((await p.locator('[aria-labelledby="disclaimer-title"]').count()) > 0, 'Escape dismissed it without an answer')
    await p.getByRole('button', { name: 'I Agree' }).press('Enter')
    await p.waitForTimeout(200)
    expect((await p.locator('[aria-labelledby="disclaimer-title"]').count()) === 0, 'I Agree by keyboard did not close it')
    await ctx.close()
  })

  await check('Insights /blogs and /blogs/<slug> redirect to /insights and /insights/<slug>, and the post renders', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) => r.fulfill({ json: content() }))
    await p.goto(`${BASE}/blogs`, { waitUntil: 'networkidle' })
    expect(new URL(p.url()).pathname === '/insights', `/blogs went to ${new URL(p.url()).pathname}`)
    await p.goto(`${BASE}/blogs/only-in-crm`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(300)
    expect(new URL(p.url()).pathname === '/insights/only-in-crm', `/blogs/only-in-crm went to ${new URL(p.url()).pathname}`)
    expect((await p.getByText('Body from the CRM.').count()) > 0, 'redirected post body did not render')
    await ctx.close()
  })

  await check('Navigation says Insights, not Blog', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) => r.fulfill({ json: content() }))
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    const labels = (await p.locator('header a').allTextContents()).map((t) => t.trim())
    expect(labels.includes('Insights'), `header links were: ${labels.join(' | ')}`)
    expect(!labels.includes('Blog'), 'header still shows a "Blog" link')
    await ctx.close()
  })

  await check('Compliance calendar shows CRM calendar items (Sunday date, extension) and never the old working-day note', async () => {
    const { ctx, page: p } = await page(browser)
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const sunday = new Date()
    sunday.setDate(sunday.getDate() + 10)
    while (sunday.getDay() !== 0) sunday.setDate(sunday.getDate() + 1)
    const ext = new Date()
    ext.setDate(ext.getDate() + 40)
    const extOriginal = new Date(ext)
    extOriginal.setDate(extOriginal.getDate() - 3)
    await ctx.route(CMS, (r) =>
      r.fulfill({
        json: content({
          compliance: {
            overrides: [],
            extra: [],
            calendar: [
              { key: 'stub-sun', ruleId: 'stub-sun', title: 'Stub Sunday Filing', law: 'GST', who: 'Test taxpayers', period: 'Test period', date: iso(sunday), originalDate: iso(sunday) },
              { key: 'stub-ext', ruleId: 'stub-ext', title: 'Stub Extended Return', law: 'Income tax', who: 'Test taxpayers', period: 'Test period', date: iso(ext), originalDate: iso(extOriginal), extension: { note: 'Stub extension notice' } },
            ],
          },
        }),
      }),
    )
    await p.goto(`${BASE}/compliance-calendar`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(400)
    const text = await p.locator('main').innerText().catch(() => p.innerText('body'))
    expect(text.includes('Stub Sunday Filing'), 'Sunday item not shown')
    const sundayRow = await p.locator('li', { hasText: 'Stub Sunday Filing' }).first().innerText()
    expect(/\bSun\b/.test(sundayRow), `Sunday item does not show a Sunday weekday: ${sundayRow.slice(0, 80)}`)
    expect(text.includes('Stub Extended Return'), 'extension item not shown')
    expect(text.includes('Extended.') && text.includes('Stub extension notice'), 'extension not shown as "Extended."')
    expect(text.includes('(was '), 'original date not shown for the extension')
    expect(!/check whether the next working day/i.test(text), 'internal working-day note is shown to the public')
    await ctx.close()
  })

  await check('Compliance calendar falls back to built-in dates when the CRM calendar is empty', async () => {
    const { ctx, page: p } = await page(browser)
    await ctx.route(CMS, (r) => r.fulfill({ json: content({ compliance: { overrides: [], extra: [], calendar: [] } }) }))
    await p.goto(`${BASE}/compliance-calendar`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(400)
    const rows = await p.locator('section[aria-labelledby] li h3').count()
    expect(rows > 0, 'empty CRM calendar blanked the public calendar')
    expect((await p.getByText('Stub Sunday Filing').count()) === 0, 'stub item leaked into the fallback')
    await ctx.close()
  })

  await check('A CRM post with a category shows it as the first tag pill', async () => {
    const { ctx, page: p } = await page(browser)
    const post = content().posts[0]
    await ctx.route(CMS, (r) => r.fulfill({ json: content({ posts: [{ ...post, category: 'GST' }] }) }))
    await p.goto(`${BASE}/insights/only-in-crm`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(300)
    const tags = await p.locator('ul[aria-label="Tags"] li').allTextContents()
    expect(tags[0] && tags[0].trim() === 'GST', `tags were: ${tags.join(' | ')}`)
    await ctx.close()
  })

  await check('Disclaimer list is justified', async () => {
    const { ctx, page: p } = await page(browser, { agreed: false })
    await ctx.route(CMS, (r) => r.fulfill({ json: content() }))
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    const align = await p.locator('[aria-labelledby="disclaimer-title"] ul').first().evaluate((el) => getComputedStyle(el).textAlign)
    expect(align === 'justify', `text-align was ${align}`)
    await ctx.close()
  })

  await browser.close()
  console.log(results.join('\n'))
})()
