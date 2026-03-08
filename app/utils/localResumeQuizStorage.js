const STORAGE_PREFIX = 'mianshiwang.resumeQuizRecords.v1'
const MAX_RECORDS = 30
const memoryStore = new Map()

const getStorageKey = (userId = 'anonymous') => `${STORAGE_PREFIX}:${userId || 'anonymous'}`

const safeParse = (raw, fallback = []) => {
	if (!raw) return fallback

	try {
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : fallback
	} catch {
		return fallback
	}
}

const readStorage = (key) => {
	if (typeof window !== 'undefined' && window.localStorage) {
		try {
			return window.localStorage.getItem(key)
		} catch {
			return memoryStore.get(key) || null
		}
	}

	return memoryStore.get(key) || null
}

const writeStorage = (key, value) => {
	if (typeof window !== 'undefined' && window.localStorage) {
		try {
			window.localStorage.setItem(key, value)
			return
		} catch {
			// Fall through to memory storage.
		}
	}

	memoryStore.set(key, value)
}

const sortByCreatedAtDesc = (records) =>
	[...records].sort(
		(a, b) =>
			new Date(b.createdAt || b.updatedAt || 0).getTime() -
			new Date(a.createdAt || a.updatedAt || 0).getTime()
	)

const normalizeRecord = (record = {}) => ({
	resultId: record.resultId,
	serviceType: 'resume',
	status: record.status || 'success',
	source: record.source || 'llm',
	createdAt: record.createdAt || new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	inputData: record.inputData || {},
	questions: Array.isArray(record.questions) ? record.questions : [],
	summary: record.summary || ''
})

export const listLocalResumeQuizRecords = (userId) => {
	const key = getStorageKey(userId)
	return sortByCreatedAtDesc(safeParse(readStorage(key)))
}

export const getLocalResumeQuizRecord = (userId, resultId) => {
	if (!resultId) return null
	return (
		listLocalResumeQuizRecords(userId).find((item) => item.resultId === resultId) ||
		null
	)
}

export const saveLocalResumeQuizRecord = (userId, record) => {
	if (!record?.resultId) return null

	const key = getStorageKey(userId)
	const normalized = normalizeRecord(record)
	const current = listLocalResumeQuizRecords(userId).filter(
		(item) => item.resultId !== normalized.resultId
	)
	const next = sortByCreatedAtDesc([normalized, ...current]).slice(0, MAX_RECORDS)

	writeStorage(key, JSON.stringify(next))
	return normalized
}

export const mapLocalResumeQuizToHistoryRecord = (record) => ({
	id: `local-history-${record.resultId}`,
	resultId: record.resultId,
	createdAt: record.createdAt,
	status: record.status || 'success',
	inputData: record.inputData || {},
	summary: record.summary || '',
	questions: record.questions || [],
	isLocalRecord: true
})

export const mapLocalResumeQuizToConsumptionRecord = (record) => ({
	recordId: `local-consumption-${record.resultId}`,
	resultId: record.resultId,
	type: 'resume_quiz',
	typeName: '面试押题',
	status: record.status || 'success',
	statusName: (record.status || 'success') === 'success' ? '已完成' : '处理中',
	description: `${record.inputData?.company || '目标公司'} · ${
		record.inputData?.positionName || '目标岗位'
	} · ${record.questions?.length || 0} 道题已缓存到本地`,
	createdAt: record.createdAt,
	inputData: record.inputData || {},
	isLocalRecord: true
})

export const mergeRecordsByResultId = (remoteRecords = [], localRecords = []) => {
	const merged = [...(Array.isArray(remoteRecords) ? remoteRecords : [])]
	const existingKeys = new Set(
		merged.map((item) => item?.resultId || item?.recordId).filter(Boolean)
	)

	for (const record of localRecords) {
		const key = record?.resultId || record?.recordId
		if (!key || existingKeys.has(key)) continue
		merged.push(record)
		existingKeys.add(key)
	}

	return sortByCreatedAtDesc(merged)
}
