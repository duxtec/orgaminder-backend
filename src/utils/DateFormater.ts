/**
 * A class that extends the Date object to provide additional date formatting capabilities.
 *
 * This class supports various date formats using format specifiers and includes localization options 
 * for month and day names. It can also return all format specifiers and their respective values 
 * in different output modes.
 */
class DateFormatter extends Date {
    /**
     * Formats the date instance based on a specified format string, locale, and calendar.
     * 
     * @param {string} format - The format string containing specifiers like 'Y', 'm', 'd', etc.
     * Specifiers are replaced with corresponding date values.
     * @param {string | null} [locale=null] - Optional. The locale to use for month and day names.
     * Defaults to system locale or 'en-US'.
     * @param {string} [calendar='gregory'] - Optional. The calendar type to use. Default is 'gregory'.
     * 
     * @returns {string | Record<string, string>} - Returns the formatted date string or an object
     * containing all possible format specifiers with their corresponding values if `format` is 'ALL' or 'OPTIONS'.
     */
    format(format: string, locale: string | null = null, calendar: string = 'gregory'): string | Record<string, string> {
        const date = new Date(this.getTime() - this.getTimezoneOffset() * 60000);

        const DEFAULT_LOCALE = process.env.LOCALE || Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';
        const DEFAULT_CALENDAR = 'gregory';

        locale = locale || DEFAULT_LOCALE.split('-')[0];
        calendar = calendar || DEFAULT_CALENDAR.toLowerCase();

        const monthNames: Record<string, string[]> = {
            'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            'es': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'pt': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        };

        const dayNames: Record<string, string[]> = {
            'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'es': ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            'pt': ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        };

        const monthNamesLocale = monthNames[locale] || monthNames["en"];
        const dayNamesLocale = dayNames[locale] || dayNames["en"];
        
        const timeMatch = date.toTimeString().match(/([+-]\d{4})/);
        const timezone = timeMatch ? timeMatch[1] : 'defaultTimezone';

        const shortMatch = date.toTimeString().match(/[A-Z]+/);
        const shortTimezone = shortMatch ? shortMatch[0] : 'defaultShortTimezone';

        const formatChars: Record<string, string> = {
            'd': String(date.getDate()).padStart(2, '0'),
            'D': dayNamesLocale[date.getDay()].slice(0, 3),
            'j': date.getDate().toString(),
            'l': dayNamesLocale[date.getDay()],
            'N': date.getDay() === 0 ? "7" : date.getDay().toString(),
            'S': (() => {
                const day = date.getDate();
                const lastDigit = day % 10;
                const lastTwoDigits = day % 100;

                if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
                    return 'th';
                }
                return ['st', 'nd', 'rd'][lastDigit - 1] || 'th';
            })(),
            'w': date.getDay().toString(),
            'z': Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000).toString(),
            'W': (() => {
                const target: Date = new Date(date.valueOf());
                const dayNr: number = (date.getDay() + 6) % 7;
                target.setDate(target.getDate() - dayNr + 3);
                const firstThursday: number = target.valueOf();
                target.setMonth(0, 1);
                
                if (target.getDay() !== 4) {
                    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
                }

                return (1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)).toString();
            })(),
            'F': monthNamesLocale[date.getMonth()],
            'm': String(date.getMonth() + 1).padStart(2, '0'),
            'M': monthNamesLocale[date.getMonth()].slice(0, 3),
            'n': (date.getMonth() + 1).toString(),
            't': (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate().toString(),
            'L': ((date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0 ? 1 : 0).toString(),
            'o': (date.getFullYear() + (date.getMonth() === 11 && date.getDate() < 29 ? 1 : (date.getMonth() === 0 && date.getDate() > 3 ? -1 : 0))).toString(),
            'Y': date.getFullYear().toString(),
            'y': String(date.getFullYear()).slice(-2),
            'a': date.getHours() < 12 ? 'am' : 'pm',
            'A': date.getHours() < 12 ? 'AM' : 'PM',
            'B': (Math.floor((((date.getUTCHours() + 1) % 24) + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) * 1000 / 24)).toString(),
            'g': (date.getHours() % 12 || 12).toString(),
            'G': date.getHours().toString(),
            'h': String(date.getHours() % 12 || 12).padStart(2, '0'),
            'H': String(date.getHours()).padStart(2, '0'),
            'i': String(date.getMinutes()).padStart(2, '0'),
            's': String(date.getSeconds()).padStart(2, '0'),
            'u': String(date.getMilliseconds()).padStart(3, '0'),
            'v': String(date.getMilliseconds()).padStart(3, '0'),
            'e': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'I': (date.getTimezoneOffset() === new Date(date.getFullYear(), 0, 1).getTimezoneOffset() ? 0 : 1).toString(),
            'O': timezone,
            'P': (() => {
                const match = date.toTimeString().match(/([+-]\d{2}):(\d{2})/);
                return match ? match[1] + ':' + match[2] : '';
            })(),
            'p': (() => {
                const match = date.toTimeString().match(/([+-]\d{2}):(\d{2})/);
                return match ? match[1] + match[2] : '';
            })(),
            'T': shortTimezone,
            'Z': (date.getTimezoneOffset() * 60).toString()
        };

        if (format === 'OPTIONS') {
            return Object.keys(formatChars).reduce((acc, key) => {
                acc[key] = formatChars[key];
                return acc;
            }, {} as Record<string, string>);
        } else if (format === 'ALL') {
            return formatChars;
        } else {
            return format.replace(/(d|D|j|l|N|S|w|z|W|F|m|M|n|t|L|o|Y|y|a|A|B|g|G|h|H|i|s|u|v|e|I|O|P|p|T|Z)/g, (match) => formatChars[match] || match);
        }
    }
}

export default DateFormatter;
