const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


describe("isLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn()
  }
  const next = jest.fn();

  test("로그인 일시 => isLoggedIn next 호출", () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    }
    isLoggedIn(req, res, next)
    expect(next).toBeCalledTimes(1)
  })

  test("로그인 아닐 시 => isLoggedIn res.status(403).send('로그인 필요')", () => {
    const req = {
      isAuthenticated: jest.fn(() => false)
    }
    isLoggedIn(req, res, next)
    expect(res.status).toBeCalledWith(403)
    expect(res.send).toBeCalledWith('로그인 필요')
  })
})

describe("isNotLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    redirect: jest.fn()
  }
  const next = jest.fn();

  test("로그인 일시 => isNotLoggedIn res.redirect(`/?error=${message}`)", () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    }
    const message = encodeURIComponent("로그인한 상태입니다.");
    isNotLoggedIn(req, res, next)
    expect(res.redirect).toBeCalledWith(`/?error=${message}`)
  })

  test("로그인 아닐 시 => isNotLoggedIn next 호출", () => {

    const req = {
      isAuthenticated: jest.fn(() => false)
    }
    isNotLoggedIn(req, res, next)
    expect(next).toBeCalledTimes(1)
  })
})