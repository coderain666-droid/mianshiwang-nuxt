/**
 * 更新用户信息
 * @returns {Promise}
 */
export const updateUserInfoAPI = ($api, body) => {
	return $api('/user/update', {
		method: 'POST',
		body
	})
}

/**
 * 获取用户信息
 */
export const getUserInfoAPI = ($api) => {
	return $api('/user/info', {
		method: 'GET'
	})
}
