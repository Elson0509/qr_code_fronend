import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import logo from '../../../../Images/logo-h-min.jpg';

const ReportHeader = (props) => {
    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            alignItems: 'center'
        },
        logo: {
            width: 200, 
            marginTop: 20
        },
        titleHeader: {
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10,
        },
    })

    return (
        <View>
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.titleHeader}>{props.title}</Text>
        </View>
    );
};

export default ReportHeader;