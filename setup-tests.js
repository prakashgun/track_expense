import MockAsyncStorage from 'mock-async-storage'
 
const mockImpl = new MockAsyncStorage()
jest.mock('@react-native-async-storage/async-storage', () => mockImpl)

jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native")
    return {
      ...actualNav,
      useNavigation: () => ({
        navigate: jest.fn(),
        dispatch: jest.fn(),
      }),
      useIsFocused: ()=>{}
    }
  })