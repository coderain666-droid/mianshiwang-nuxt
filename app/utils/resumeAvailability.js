export const isResumeReuploadRequired = (resume) => {
	if (!resume || resume.isManual || resume.isJianLiWang) return false
	return resume.sourceType === 'url_upload' && !resume.content
}

export const getResumeReuploadMessage = (resume) => {
	if (!isResumeReuploadRequired(resume)) return ''
	return '这份简历是旧的外链记录，本地模式下请重新上传文件'
}
