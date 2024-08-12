export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  if (/chrome|crios|crmo/i.test(userAgent) && !/edge|edg|opr/i.test(userAgent)) {
    return 'Chrome';
  } else if (/firefox|iceweasel|fxios/i.test(userAgent)) {
    return 'Firefox';
  } else if (/safari/i.test(userAgent) && !/chrome|crios|crmo|opr/i.test(userAgent)) {
    return 'Safari';
  } else if (/opr\//i.test(userAgent)) {
    return 'Opera';
  } else if (/edg|edge|edgios|edga/i.test(userAgent)) {
    return 'Edge';
  } else {
    return 'Other';
  }
};