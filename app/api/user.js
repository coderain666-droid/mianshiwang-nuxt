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
