import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify';
import { USER_KIND, TOAST_CONFIG } from './constants'

export const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      900,
      1200,
      "JPEG",
      60,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

export const saudacaoHorario = (name) => {
    if (!name) return '' 
    const stamp = new Date();
    const hours = stamp.getHours();
    const first = firstName(name)
    if (hours>=0 && hours<6) {
       return `Boa Madrugada, ${first}`;
   }
   
   if (hours>=6 && hours<12) {
       return `Bom Dia, ${first}`;
   }

   if (hours>=12 && hours<18) {
       return `Boa Tarde, ${first}`;
   }

    if (hours>=18 && hours<24) {
        return `Boa Noite, ${first}`;
    }     
    
   return `Bom Dia, ${first}`
}

export const iconHour = () => {
    const stamp = new Date();
    const hours = stamp.getHours();
    if (hours>=0 && hours<6) {
       return `moon`;
   }
   
   if (hours>=6 && hours<12) {
       return `coffee`;
   }

   if (hours>=12 && hours<18) {
       return `sun`;
   }

    if (hours>=18 && hours<24) {
        return `moon`;
    }     
    
   return `coffee`
}

const firstName = name => {
    const first = name.substring(0, name.indexOf(' '))
    return first || name
}

const isLetter = c => {
    return c.toLowerCase() !== c.toUpperCase();
}

const isNumber = c => {
    return c >= '0' && c <= '9'
}

export const isUUID = uuid => {
    const resp = uuid.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    return resp !== null
}

export const isBrazilLicensePlateNewModel = plate =>{
    if(plate.length !== 7)
        return false
    if(isLetter(plate[4]))
        return true
    return false
}

export const oldModelPlateFormat = plate =>{
    if(plate.length < 3)
        return plate
    let format = plate.substring(0, 3) + '·' +plate.substring(3, plate.length)
    return format
}

export const isValidDate = (day, month, year) =>
{
    if(!day || !month || !year)
        return false
    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;
    const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

export const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const printDate = date => {
    if(!date)
        return null
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    const weekday = [];
    weekday[0] = "Domingo";
    weekday[1] = "Segunda-feira";
    weekday[2] = "Terça-feira";
    weekday[3] = "Quarta-feira";
    weekday[4] = "Quinta-feira";
    weekday[5] = "Sexta-feira";
    weekday[6] = "Sábado";
    return dd + '/' + mm + '/' + yyyy //+ '('+weekday[date.getDay()] + ')';
}

export const printDateAndHour = date => {
    if(!date)
        return null
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }


    return `${dd}/${mm}/${yyyy} ${date.getHours()}:${date.getMinutes()}`
}

export const plateSizeValidator = plate => {
    return plate.length !== 7 ? false : true
}

export const validatePlateFormat = plate => {
    if (!plateSizeValidator(plate))
        return false
    return isLetter(plate[0]) &&
           isLetter(plate[1]) &&
           isLetter(plate[2]) &&
           isNumber(plate[3]) &&
           (isLetter(plate[4]) || isNumber(plate[4])) &&
           isNumber(plate[5]) &&
           isNumber(plate[6])
}

export const urlToBlobObject = async url => {
    return await fetch(url).then(r => r.blob())
}

export const aptNumberAnalyse = (first, last) => {
    //verify if they are only numbers
    if(isNaN(first) || isNaN(last)){
        //not numbers
        //verify if both are not numbers
        if(!isNaN(first) || !isNaN(last)){
            return null
        }
        //assume that the last digit is a letter
        const letterFirstApt = first.charAt(first.length-1).toUpperCase()
        const letterLastApt = last.charAt(last.length-1).toUpperCase()
        if(letterFirstApt>letterLastApt)
            return null
        //removing last digit
        const newFirst = first.substring(0, first.length-1)
        const newLast = last.substring(0, last.length-1)
        //checking if they are still numbers
        if(isNaN(newFirst) || isNaN(newLast))
            return null
        //getting the array of apts
        const aptArrayWhithoutLetters = aptNumberAnalyseOnlyNumbers(newFirst, newLast)
        if(!aptArrayWhithoutLetters)
            return null
        const apts = []
        for(let i = letterFirstApt.charCodeAt(); i<=letterLastApt.charCodeAt(); i++){
            aptArrayWhithoutLetters.forEach(apt=>{
                apts.push(apt+String.fromCharCode(i))
            })
        }
        return apts
    }
    else{
        return aptNumberAnalyseOnlyNumbers(first, last)
    }
}

const aptNumberAnalyseOnlyNumbers = (first, last) => {
    if(Number(last) <= (first)){
        return null
    }
    const qttDigitsFirstApt = first.length
    const qttDigitsLastApt = last.length
    if(qttDigitsFirstApt>qttDigitsLastApt)
        return null
    //getting number of floors
    const firstfloor = Number(first[0])
    const lastFloor = Number(last.substr(0, qttDigitsLastApt - qttDigitsFirstApt + 1))
    //getting qtt apartments per floor
    const firstAptNumber = Number(first.substring(first.length - (qttDigitsFirstApt - 1)))
    const lastAptNumber = Number(last.substring(last.length - (qttDigitsFirstApt - 1)))
    //creating array of apartment numbers
    const apts = []
    for(let i = firstfloor; i <= lastFloor; i++){
        for(let j = firstAptNumber; j <= lastAptNumber; j++){
            let apt = i * Math.pow(10, qttDigitsFirstApt - 1)
            apt+=j
            apts.push(apt)
        }
    }
    return apts
}

export const toastError = (err, messageError) => {
    if(err?.message === 'timeout'){
        toast.error('Pedido abortado devido a problema de rede.', TOAST_CONFIG)
    }else{
        toast.error(messageError || 'Ocorreu um erro inesperado.', TOAST_CONFIG)
    }
}

export const checkInternetConnection = (setLoading) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            toast.error('Não há conexão com a internet.')
            if(setLoading)
                setLoading(false)
            reject(false)
        }, 2000)
        fetch('https://www.google.com/', {
            method: 'HEAD',
            timeout: 3000,
            mode: 'no-cors'
        }).then(() => {
            clearTimeout(timeout)
            resolve(true)
        }).catch(() => {
            clearTimeout(timeout)
            toast.error('Não há conexão com a internet.')
            if(setLoading)
                setLoading(false)
            reject(false)
        })
    })
}

export const removeAccent = text => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

export const canShowMessage = user => {
    if(!user || !user.condo)
        return false
    if(!user.condo.guard_can_messages && !user.condo.resident_can_messages)
        return false
    if((user.user_kind === USER_KIND['GUARD'] && user.condo.guard_can_messages) ||
       (user.user_kind === USER_KIND['RESIDENT'] && user.condo.resident_can_messages) ||
       (user.user_kind !== USER_KIND['GUARD'] && user.user_kind !== USER_KIND['RESIDENT']))
        return true
    return false
}

export const canAddThirds = user => {
    if(!user || !user.condo)
        return false
    if((user.user_kind === USER_KIND['GUARD'] && user.condo.guard_can_thirds) ||
       (user.user_kind === USER_KIND['RESIDENT'] && user.condo.resident_can_thirds) ||
       (user.user_kind === USER_KIND['SUPERINTENDENT']))
        return true
    return false
}


export const condoHasMail = user => {
    if(!user || !user.condo)
        return false
    if(user.condo.condo_has_mail)
        return true
    return false
}

export const condoHasNews = user => {
    if(!user || !user.condo)
        return false
    if(user.condo.condo_has_news && user.user_kind !== USER_KIND['GUARD'])
        return true
    return false
}

export const condoHasAnyService = user => {
    if(!user || !user.condo)
        return false
    if(user.condo.condo_has_mail || user.condo.condo_has_classifieds || user.condo.condo_has_news || user.condo.condo_has_reservations)
        return true
    return false
}

export const canAddVisitors = user => {
    if(!user || !user.condo)
        return false
    if((user.user_kind === USER_KIND['GUARD'] && user.condo.guard_can_visitors) ||
       (user.user_kind === USER_KIND['RESIDENT'] && user.condo.resident_can_visitors) ||
       (user.user_kind === USER_KIND['SUPERINTENDENT']))
        return true
    return false
}

export const canAddOcorrences = user => {
    if(!user || !user.condo)
        return false
    if((user.user_kind === USER_KIND['RESIDENT'] && user.condo.resident_can_ocorrences) ||
       (user.user_kind === USER_KIND['SUPERINTENDENT'] || user.user_kind === USER_KIND['GUARD']))
        return true
    return false
}

export const phone_validation = phone => {
    let telefone = phone.replace(/\D/g, '');
    if (!(telefone.length >= 10 && telefone.length <= 11)) return false;
    if (telefone.length === 11 && parseInt(telefone.substring(2, 3)) !== 9) return false;
    for (let n = 0; n < 10; n++) {
        if (telefone === new Array(11).join(n) || telefone === new Array(12).join(n)) return false;
    }
    const codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73,
        74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95,
        96, 97, 98, 99];
    if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) === -1) return false;
    if (new Date().getFullYear() < 2017) return true;
    if (telefone.length === 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) === -1) return false;
    return true;
}

export const testWordWithNoSpecialChars = sentence => {
    if (!sentence) return true
    return /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/.test(sentence)
}

export const testStrongPassword = sentence => {
    if (!sentence) return false
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(sentence)
}

