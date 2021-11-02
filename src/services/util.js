import Resizer from 'react-image-file-resizer'

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

export const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = Buffer.from(b64Data, 'base64')
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return URL.createObjectURL(blob);
  }

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