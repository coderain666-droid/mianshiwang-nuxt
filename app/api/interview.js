/**
 * 处理简历押题
 * @param {Object} data
 * @param {string} data.resumeId
 * @param {string} data.positionId
 * @param {string} data.company
 * @param {string} data.minSalary
 * @param {string} data.maxSalary
 * @param {string} data.jd
 * @returns {Promise}
 */
export const generateWechatQRCodeAPI = ($api) => {
	return $api('/interview/resume/quiz/stream', {
		method: 'post'
	})
}
