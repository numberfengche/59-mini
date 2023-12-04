import { MiniUserLoginRequest, MiniUserLoginResponse } from "./wltype";

/**
 * @description "小程序/用户/登录"
 * @param req
 */
export function miniUserLogin(req: MiniUserLoginRequest) {
	return webapi.post<MiniUserLoginResponse>("/api/mini/user/login", req)
}
