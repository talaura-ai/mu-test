/**
 * This class will provide headers according to request's need
 */

const getPublicheader = () =>{
  return {
    'x-test-api-host': 'rsystems.com',
    'x-test-key': 'r-systems-api-key'
  }
}

const getProtectedHeader = () =>{
  return {
    'x-test-api-host': 'im.rsystems.com',
    'x-test-key': 'r-systems-api-key-1'
  }
}

const ApiHeaders =  { getProtectedHeader, getPublicheader }

export default ApiHeaders
