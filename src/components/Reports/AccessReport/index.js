import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { USER_KIND_NAME } from '../../../services/constants'
import logo from '../../../Images/logo-h-min.jpg'
import { printDate } from '../../../services/util'

// Create styles
const styles = StyleSheet.create({
  table: {
    width: '100%',
    padding: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 9,
  },
  header: {
    borderTop: 'none',
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  titleHeader: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  titleSubHeader: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 10,
    textDecoration: 'underline',
  },
  row1: {
    width: '15%',
  },
  row2: {
    width: '15%',
  },
  row3: {
    width: '28%',
  },
  row4: {
    width: '12%',
  },
  row5: {
    width: '15%',
  },
  row6: {
    width: '15%',
  },
})

const index = (props) => {
  const getAccess = line => {
    return (
      <View>
        <Text style={styles.title}>Usuários{'\n'}</Text>
        {
          line.UserAccesses.map((ac, ind) => {
            return (
              <View >
                <Text>{ind + 1}. {ac.name}{'\n'}</Text>
                {!!ac.identification && <Text>ID: {ac.identification}{'\n'}</Text>}
                {!!ac.company && <Text className='p-0 m-0 mb-2'>Empresa: {ac.company}{'\n'}</Text>}
              </View>
            )
          })
        }
        {!!line.VehicleAccesses?.length && <Text style={styles.title}>{'\n'}Veículos{'\n'}</Text>}
        {
          !!line.VehicleAccesses?.length && line.VehicleAccesses.map((va, ind) => {
            return (
              <View>
                <Text>{ind + 1}.{va.maker} {va.model} {va.color}{'\n'}</Text>
                <Text>Placa: {va.plate}{'\n'}</Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page} author='QR Condo' subject='Relatório'>
        <View style={{display: 'flex', alignItems: 'center'}}>
          <Image source={logo} style={{ width: 200, marginTop: 20 }} />
        </View>
        <Text style={styles.titleHeader}>Relatório de Acessos</Text>
        {!!props.inicialDate && !!props.finalDate && <Text style={styles.titleSubHeader}>Acessos entre {printDate(props.inicialDate)} e {printDate(props.finalDate)}</Text>}
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={styles.row1}>Horário</Text>
            <Text style={styles.row2}>Registro</Text>
            <Text style={styles.row3}>Acesso</Text>
            <Text style={styles.row4}>Tipo</Text>
            <Text style={styles.row5}>Unidade</Text>
            <Text style={styles.row6}>Controlador de Acesso</Text>
          </View>
          {
            props.accesses.map((access, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.row1}>{new Date(access.updatedAt).toLocaleString()}</Text>
                <Text style={styles.row2}>{access.TypeAccess.type}</Text>
                <Text style={styles.row3}>{getAccess(access)}</Text>
                <Text style={styles.row4}>{USER_KIND_NAME[access.user_kind_id]}</Text>
                <Text style={styles.row5}>Bloco {access.bloco_name}{'\n'}Unidade {access.unit_number}</Text>
                <Text style={styles.row6}>{access.ControllerAccess.name}{'\n'}{USER_KIND_NAME[access.ControllerAccess.user_kind_id]}</Text>
              </View>
            ))
          }
        </View>
      </Page>
    </Document>
  );
};

export default index;