import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { USER_KIND_NAME, PREFIX_IMG_GOOGLE_CLOUD } from '../../../services/constants'
import { printDate, } from '../../../services/util'
import ReportHeader from '../components/ReportHeader'

// Create 
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
});

const styles = StyleSheet.create({
  bold: {
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  titleSubHeader: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  eventDiv: {
    fontSize: 12,
    padding: 10,
    borderBottom: '1px solid black',
  },
  eventImages: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#efefef',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  eventImage: {
    flexFlow: 1,
    width: '32%',
    height: 100,
    border: '1px solid black',
    marginLeft: '1%',
    marginTop: '1%',
  }
})

const EventReport = (props) => {
  console.log(props)

  return (
    <Document>
      <Page size="A4" style={styles.page} author='QR Condo' subject='Relatório'>
        <ReportHeader title='Relatório de Ocorrências' />
        {!!props.inicialDate && !!props.finalDate && <Text style={styles.titleSubHeader}>Eventos entre {printDate(props.inicialDate)} e {printDate(props.finalDate)}</Text>}
        <View>
          {
            props.events.map((event) => {
              return (
                <View key={event.id} style={styles.eventDiv}>
                  {!!event.OccurrenceType && <Text><Text style={styles.bold}>Assunto: </Text>{event.OccurrenceType.type}</Text>}
                  {!!event.created_at && <Text><Text style={styles.bold}>Data: </Text>{new Date(event.created_at).toLocaleString()}</Text>}
                  {!!event.place && <Text><Text style={styles.bold}>Local: </Text>{event.place}</Text>}
                  {!!event.userRegistering.name && <Text><Text style={styles.bold}>Quem registrou: </Text>{event.userRegistering.name} ({USER_KIND_NAME[event.userRegistering.user_kind_id]})</Text>}
                  {!!event.description && <Text><Text style={styles.bold}>Descrição: </Text>{event.description}</Text>}
                  {
                    !!event.OccurrenceImages && event.OccurrenceImages.length > 0 &&
                    <View style={styles.eventImages}>
                      <View style={styles.eventImage}>
                        {/* {console.log(PREFIX_IMG_GOOGLE_CLOUD + event.OccurrenceImages[0].photo_id)} */}
                        <Image src={{ uri: 'https://drive.google.com/uc?export=view&id=1cos-APZd1DqoVVioNVBYeR2HNVpKvOGf', method: 'GET', headers:  { 'Access-Control-Allow-Origin': '*', }, body: '' }} style={{ width: 'auto', height: 100 }} />
                      </View>
                    </View>
                  }
                </View>
              )
            })
          }
        </View>
      </Page>
    </Document>
  );
};

export default EventReport;