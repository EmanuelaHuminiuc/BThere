import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateTimePicker = (props) => {

    const selectedDate = props.date ? <Text>selected: {props.date.toLocaleString()}</Text> : <Text>selected:</Text>
  
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <View>
          
              <DateTimePickerModal
                isVisible={props.isVisible}
                mode={props.mode}
                date={props.currentDate}
                onConfirm={props.onConfirm}
                onCancel={props.onCancel}
                is24Hour={props.is24Hour}
              />
            
        </View>
      </KeyboardAvoidingView>
    )
}

export default DateTimePicker

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
      }
})