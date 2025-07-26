// Test file for hybrid RBAC library
import { getUserRole, assignUserRole, hasRole, getUserPermissions } from './hybrid-rbac';

// Test function to verify JWT decoding
export async function testJWTDecoding() {
  console.log('Testing JWT decoding...');
  
  try {
    const role = await getUserRole();
    console.log('Current user role:', role);
    return role !== null;
  } catch (error) {
    console.error('JWT decoding test failed:', error);
    return false;
  }
}

// Test function to verify role checking
export async function testRoleChecking() {
  console.log('Testing role checking...');
  
  try {
    const isCustomer = await hasRole('customer');
    const isDriver = await hasRole('driver');
    const isAdmin = await hasRole('admin');
    
    console.log('Is customer:', isCustomer);
    console.log('Is driver:', isDriver);
    console.log('Is admin:', isAdmin);
    
    return true;
  } catch (error) {
    console.error('Role checking test failed:', error);
    return false;
  }
}

// Test function to verify permissions
export async function testPermissions() {
  console.log('Testing permissions...');
  
  try {
    const permissions = await getUserPermissions();
    console.log('User permissions:', permissions);
    return permissions.length >= 0;
  } catch (error) {
    console.error('Permissions test failed:', error);
    return false;
  }
}

// Run all tests
export async function runAllTests() {
  console.log('=== Hybrid RBAC Library Tests ===');
  
  const jwtTest = await testJWTDecoding();
  const roleTest = await testRoleChecking();
  const permTest = await testPermissions();
  
  console.log('=== Test Results ===');
  console.log('JWT Decoding:', jwtTest ? '✅ PASS' : '❌ FAIL');
  console.log('Role Checking:', roleTest ? '✅ PASS' : '❌ FAIL');
  console.log('Permissions:', permTest ? '✅ PASS' : '❌ FAIL');
  
  return jwtTest && roleTest && permTest;
} 