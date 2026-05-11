import React from 'react'
import { StyleSheet, LogBox} from 'react-native';
import DashboardNavigator from './src/Common/DashboardNavigator';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function App() {
  return (
      <DashboardNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
