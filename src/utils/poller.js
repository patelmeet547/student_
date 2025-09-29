// import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { showLocalNotification } from './notifications';

// let intervalHandle = null;
// let lastIds = { ann: null, hw: null, leave: null };

// async function fetchJson(url, headers) {
// 	const response = await fetch(url, { headers });
// 	if (!response.ok) throw new Error(`HTTP ${response.status}`);
// 	return await response.json();
// }

// function getLatestId(list) {
// 	if (!Array.isArray(list) || list.length === 0) return null;
// 	// assume items are in descending order by createdAt or id
// 	return list[0]?._id || list[0]?.id || null;
// }

// export async function startPoller({ userId, classId }) {
// 	if (intervalHandle) return;

// 	intervalHandle = setInterval(async () => {
// 		try {
// 			if (!userId) return;

// 			const token = await AsyncStorage.getItem('authToken');
// 			const headers = {
// 				'Content-Type': 'application/json',
// 				...(token && { Authorization: `Bearer ${token}` }),
// 			};

// 			// Announcements (needs classId)
// 			if (classId) {
// 				const annUrl = `https://quantumflux.in:5001/class/${classId}/announcement`;
// 				const ann = await fetchJson(annUrl, headers);
// 				const latestAnnId = getLatestId(ann);
// 				if (latestAnnId && latestAnnId !== lastIds.ann) {
// 					if (lastIds.ann !== null) {
// 						showLocalNotification({
// 							title: 'New Announcement',
// 							message: `${ann[0]?.title || 'New announcement posted'}`,
// 							data: { type: 'announcement', id: latestAnnId },
// 						});
// 					}
// 					lastIds.ann = latestAnnId;
// 				}
// 			}

// 			// Homework
// 			if (classId) {
// 				const hwUrl = `https://quantumflux.in:5001/class/${classId}/homework`;
// 				const hw = await fetchJson(hwUrl, headers);
// 				const latestHwId = getLatestId(hw);
// 				if (latestHwId && latestHwId !== lastIds.hw) {
// 					if (lastIds.hw !== null) {
// 						showLocalNotification({
// 							title: 'New Homework',
// 							message: `${hw[0]?.title || 'New homework assigned'}`,
// 							data: { type: 'homework', id: latestHwId },
// 						});
// 					}
// 					lastIds.hw = latestHwId;
// 				}
// 			}

// 			// Leaves (for the user)
// 			const leaveUrl = `https://quantumflux.in:5001/user/${userId}/leave`;
// 			const leaves = await fetchJson(leaveUrl, headers);
// 			const latestLeaveId = getLatestId(leaves);
// 			if (latestLeaveId && latestLeaveId !== lastIds.leave) {
// 				if (lastIds.leave !== null) {
// 					showLocalNotification({
// 						title: 'Leave Update',
// 						message: `${leaves[0]?.status ? `Leave ${leaves[0].status}` : 'New leave record'}`,
// 						data: { type: 'leave', id: latestLeaveId },
// 					});
// 				}
// 				lastIds.leave = latestLeaveId;
// 			}
// 		} catch (error) {
// 			// Swallow errors to keep interval alive
// 		}
// 	}, 2000);
// }

// export function stopPoller() {
// 	if (intervalHandle) {
// 		clearInterval(intervalHandle);
// 		intervalHandle = null;
// 		lastIds = { ann: null, hw: null, leave: null };
// 	}
// }


