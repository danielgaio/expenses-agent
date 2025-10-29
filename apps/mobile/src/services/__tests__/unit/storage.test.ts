// Example unit test for storage service
import { storageService } from '../storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('storageService', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  it('should store and retrieve data', async () => {
    const key = 'test-key';
    const value = { foo: 'bar' };
    
    await storageService.set(key, value);
    const result = await storageService.get(key);
    
    expect(result).toEqual(value);
  });

  it('should return null for non-existent key', async () => {
    const result = await storageService.get('non-existent');
    expect(result).toBeNull();
  });

  it('should remove data', async () => {
    const key = 'test-key';
    await storageService.set(key, { foo: 'bar' });
    await storageService.remove(key);
    const result = await storageService.get(key);
    
    expect(result).toBeNull();
  });
});
