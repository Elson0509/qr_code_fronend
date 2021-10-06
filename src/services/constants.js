
export const API_URL_PREFIX = 'http://'
export const API_URL = 'localhost'
export const API_PORT = 3333
export const API_SERVER_URL = '/api/'
//lt --port 3000

const TOAST_CONFIG = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

export const MIN_PASSWORD_SIZE = 6

export const borderTextInputWidth = 3

//scan qr code
export const QR_CODE_PREFIX = 'epw:'
export const TYPE_DATA_QRCODE = 256
export const MAX_COMMENT_SIZE = 500
export const is_autorized_backgroundColor = '#00B924'
export const is_not_autorized_backgroundColor = '#FF726F'

export const menuOptions = [
    { menuName: "Adicionar", icon: 'plus-square', key: 'plus', screen: 'Add' },
    { menuName: "Listar", icon: 'list-alt', key: 'list', screen: 'List' },
]

export const USER_KIND_NAME = {
    1: 'Morador',
    2: 'Guarda',
    3: 'Administrador',
    4: 'Visitante',
    5: 'Terceirizado',
    6: 'Sócio',
}

export const USER_KIND = {
    'RESIDENT': 1,
    'GUARD': 2,
    'SUPERINTENDENT': 3,
    'VISITOR': 4,
    'THIRD': 5,
    'ADM': 6,
}

export const backgroundColors = {
    "Cars":'#00CCEE',
    "Dashboard":'#00AAEE',
    "Events":'#FF69B4',
    "Guards":'#CCCC00',
    "Info":'#F699CD',
    "MyQRCode":'#C1C1C1',
    "Residents":'#80E0B0',
    "Scan":'#FED8B1',
    "Thirds":'#FF7F7F',
    "Units":'#DEB887',
    "Visitors":'#9E8EEA',
    "Survey": '#FFFFFF'
}

export const backgroundLightColors = {
    "Cars":'#8AFFFF',
    "Events":'#FFB6C1',
    "Guards":'#FFFF99',
    "Info":'#FEC5E5',
    "MyQRCode":'#EEEEEE',
    "Residents":'#DDFFDD',
    "Scan":'#FEE9C2',
    "Thirds":'#FFBFBF',
    "Units":'#FFEBCD',
    "Visitors":'#CFBFFF',
}

export const backgroundDarkColors = {
    "Cars":'#00A2A2',
    "Dashboard":'#0088CC',
    "Events":'#FF1493',
    "Guards":'#999900',
    "Info":'#FD5DA8',
    "MyQRCode":'#AAAAAA',
    "Residents":'#66CAB0',
    "Scan":'#DEB690',
    "Thirds":'#CC5C5C',
    "Units":'#CD853F',
    "Visitors":'#7C6CC8',
}
