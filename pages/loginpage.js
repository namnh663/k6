export class LoginPage {
    constructor(page) {
        this.page = page
        this.inputUsername = page.locator('#user-name')
        this.inputPassword = page.locator('#password')
        this.btnLogin = page.locator('#login-button');
        this.errMessage = page.locator('h3[data-test="error"]')
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com')
      }

    async login(username, password) {
        await this.inputUsername.type(username);
        await this.inputPassword.type(password);
        await this.btnLogin.click();
    }

    getErrorMessage() {
        return this.errMessage.innerText()
    }
}
