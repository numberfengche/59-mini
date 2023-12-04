export interface MiniUserLoginRequest {
	code: string // wx.login获取的code
}
export interface MiniUserSessionResponse {
	openid: string
	nickname: string // 昵称（可能空）
	avatar_url: string // 头像（可能空）
}
export interface MiniUserLoginResponse {
	token: string // 保存在Cookie中，以后访问接口使用
	expires_in: number // 过期时间（秒）
	avatar_url: string // 头像
	nickname: string // 昵称
}