'use strict'

const puppeteer = require('puppeteer')

module.exports = {
  pdf: async html => {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      })
      const page = await browser.newPage()
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      })
      const buffer = await page.pdf({
        printBackground: true,
        format: 'Letter'
      })
      await page.close()
      await browser.close()
      return buffer
    } catch (err) {
      throw err
    }
  }
}
