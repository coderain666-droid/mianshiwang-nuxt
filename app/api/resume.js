/**
 * 获取简历列表
 * @param {*} data
 * @returns
 */
export const getResumeListAPI = ($api) => {
	return $api(`/resume/getResumeList`)
}
