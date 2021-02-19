const { addFollowings } = require("./user")
jest.mock("../models/user")
const User = require("../models/user")

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 }
  }
  const res = {
    status: jest.fn(() => res),
    send: jest.fn()
  }
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 한다.", async () => {
    User.findOne.mockReturnValue(Promise.resolve({ id: 1, name: "BlueWolFox", addFollowings: jest.fn() }))
    await addFollowings(req, res, next)
    expect(res.send).toBeCalledWith("success");
  })

  test("사용자를 못찾아 res.status(404).send('no user') 호출", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null))
    await addFollowings(req, res, next)
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");

  })

  test("DB 서버 에러, next(error)보내야함", async () => {
    const error = "테스트용 에러"
    User.findOne.mockReturnValue(Promise.reject(error))
    await addFollowings(req, res, next)
    expect(next).toBeCalledWith(error);

  })
})