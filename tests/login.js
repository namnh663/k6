import { browser } from 'k6/experimental/browser'
import { check } from 'k6';

import { LoginPage } from '../pages/loginpage.js'

export const options = {
  scenarios: {
    s1: {
      executor: 'shared-iterations',
      exec: 'tc1',
      options: {
        browser: {
          type: 'chromium',
        }
      }
    },
    s2: {
      executor: 'shared-iterations',
      exec: 'tc2',
      options: {
        browser: {
          type: 'chromium',
        }
      }
    }
  }
};

export async function tc1() {
  const context = browser.newContext()
  const page = context.newPage()
  const loginpage = new LoginPage(page)

  try {
    await loginpage.goto()
    await loginpage.login('standard_user', '123')

    check(loginpage, {
      'TC1 - Invalid password': p => p.errMessage.textContent() == 'Epic sadface: Username and password do not match any user in this service',
    })
  } finally {
    page.close()
  }
}

export async function tc2() {
  const context = browser.newContext()
  const page = context.newPage()
  const loginpage = new LoginPage(page)

  try {
    await loginpage.goto()
    await loginpage.login('locked_out_user', 'secret_sauce')

    check(loginpage, {
      'TC2 - Locked account': p => p.errMessage.textContent() == 'Epic sadface: Sorry, this user has been locked out.',
    })
  } finally {
    page.close()
  }
}