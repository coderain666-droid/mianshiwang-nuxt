/**
 * 获取简历列表
 * @param {*} data
 * @returns
 */
export const getResumeListAPI = ($api) => {
	return $api(`/resume/getInterviewResumeList`)
}

/**
 * 上传简历的接口
 * export class UploadResumeDto {
  url: string;
  resumeName: string;
  uploadTime: string; // 客户端传入，服务端转换为Date
}
 */
export const uploadResumeAPI = ($api, body) => {
	return $api(`/resume/uploadResume`, {
		method: 'POST',
		body
	})
}
