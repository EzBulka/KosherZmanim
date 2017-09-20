import StringBuffer from "../polyfills/StringBuffer";
import SimpleDateFormat from "../polyfills/SimpleDateFormat";
import DecimalFormat from "../polyfills/DecimalFormat";
import Calendar from "../polyfills/Calendar";
import GregorianCalendar from "../polyfills/GregorianCalendar";
import TimeZone from "../polyfills/TimeZone";
import Time from "./Time";
import AstronomicalCalendar from "../AstronomicalCalendar";
import ZmanimCalendar from "../ZmanimCalendar";
import ComplexZmanimCalendar from "../ComplexZmanimCalendar";
import Zman from "./Zman";
import Utils from "../polyfills/utils";

/**
 * A class used to format both non {@link java.util.Date} times generated by the Zmanim package as well as Dates. For
 * example the {@link net.sourceforge.zmanim.AstronomicalCalendar#getTemporalHour()} returns the length of the hour in
 * milliseconds. This class can format this time.
 * 
 * @author &copy; Eliyahu Hershfeld 2004 - 2014
 * @version 1.2
 */
export default class ZmanimFormatter {
    private prependZeroHours: boolean = false;

    private useSeconds: boolean = false;

    private useMillis: boolean = false;

    private static minuteSecondNF: DecimalFormat = new DecimalFormat("00");

    private hourNF: DecimalFormat;

    private static milliNF: DecimalFormat = new DecimalFormat("000");

    private dateFormat: SimpleDateFormat;

    private timeZone: TimeZone = null; // TimeZone.getTimeZone("UTC");

    // private DecimalFormat decimalNF;

    /**
     * @return the timeZone
     */
    public getTimeZone(): TimeZone {
        return this.timeZone;
    }

    /**
     * @param timeZone
     *            the timeZone to set
     */
    public setTimeZone(timeZone: TimeZone): void {
        this.timeZone = timeZone;
    }

    /**
     * Format using hours, minutes, seconds and milliseconds using the xsd:time format. This format will return
     * 00.00.00.0 when formatting 0.
     */
    public static readonly SEXAGESIMAL_XSD_FORMAT: number = 0;

    private timeFormat: number = ZmanimFormatter.SEXAGESIMAL_XSD_FORMAT;

    /**
     * Format using standard decimal format with 5 positions after the decimal.
     */
    public static readonly DECIMAL_FORMAT: number = 1;

    /** Format using hours and minutes. */
    public static readonly SEXAGESIMAL_FORMAT: number = 2;

    /** Format using hours, minutes and seconds. */
    public static readonly SEXAGESIMAL_SECONDS_FORMAT: number = 3;

    /** Format using hours, minutes, seconds and milliseconds. */
    public static readonly SEXAGESIMAL_MILLIS_FORMAT: number = 4;

    /** constant for milliseconds in a minute (60,000) */
    public static readonly MINUTE_MILLIS: number = 60 * 1000;

    /** constant for milliseconds in an hour (3,600,000) */
    public static readonly HOUR_MILLIS: number = ZmanimFormatter.MINUTE_MILLIS * 60;

    /**
     * Format using the XSD Duration format. This is in the format of PT1H6M7.869S (P for period (duration), T for time,
     * H, M and S indicate hours, minutes and seconds.
     */
    public static readonly XSD_DURATION_FORMAT: number = 5;

    /**
     * constructor that defaults to this will use the format "h:mm:ss" for dates and 00.00.00.0 for {@link Time}.
     * @param timeZone the TimeZone Object
     */
/*
    public ZmanimFormatter(timeZone: TimeZone) {
        this(0, new SimpleDateFormat("h:mm:ss"), timeZone);
    }
*/

    // public ZmanimFormatter() {
    // this(0, new SimpleDateFormat("h:mm:ss"), TimeZone.getTimeZone("UTC"));
    // }

    /**
     * ZmanimFormatter constructor using a formatter
     *
     * @param format
     *            int The formatting style to use. Using ZmanimFormatter.SEXAGESIMAL_SECONDS_FORMAT will format the time
     *            time of 90*60*1000 + 1 as 1:30:00
     * @param dateFormat the SimpleDateFormat Object
     * @param timeZone the TimeZone Object
     */
    constructor(timeZone: TimeZone)
    constructor(format: number, dateFormat: SimpleDateFormat, timeZone: TimeZone)
    constructor(formatOrTimeZone: number | TimeZone, dateFormat?: SimpleDateFormat, timeZone?: TimeZone) {
        let format: number = 0;
        if (dateFormat) {
            format = formatOrTimeZone as number;
        } else {
            format = 0;
            dateFormat = new SimpleDateFormat("h:mm:ss");
            timeZone = formatOrTimeZone as TimeZone;
        }

        this.setTimeZone(timeZone);
        let hourFormat: string = "0";
        if (this.prependZeroHours) {
            hourFormat = "00";
        }
        this.hourNF = new DecimalFormat(hourFormat);
        this.setTimeFormat(format);
        dateFormat.setTimeZone(timeZone);
        this.setDateFormat(dateFormat);
    }

    /**
     * Sets the format to use for formatting.
     *
     * @param format
     *            int the format constant to use.
     */
    public setTimeFormat(format: number): void {
        this.timeFormat = format;
        switch (format) {
        case ZmanimFormatter.SEXAGESIMAL_XSD_FORMAT:
            this.setSettings(true, true, true);
            break;
        case ZmanimFormatter.SEXAGESIMAL_FORMAT:
            this.setSettings(false, false, false);
            break;
        case ZmanimFormatter.SEXAGESIMAL_SECONDS_FORMAT:
            this.setSettings(false, true, false);
            break;
        case ZmanimFormatter.SEXAGESIMAL_MILLIS_FORMAT:
            this.setSettings(false, true, true);
            break;
        // case DECIMAL_FORMAT:
        // default:
        }
    }

    /**
     * Sets the SimpleDateFormat Object
     * @param simpleDateFormat the SimpleDateFormat Object to set
     */
    public setDateFormat(simpleDateFormat: SimpleDateFormat): void {
        this.dateFormat = simpleDateFormat;
    }

    /**
     * returns the SimpleDateFormat Object
     * @return the SimpleDateFormat Object
     */
    public getDateFormat(): SimpleDateFormat {
        return this.dateFormat;
    }

    private setSettings(prependZeroHours: boolean, useSeconds: boolean, useMillis: boolean): void {
        this.prependZeroHours = prependZeroHours;
        this.useSeconds = useSeconds;
        this.useMillis = useMillis;
    }

    /**
     * A method that formats milliseconds into a time format.
     *
     * @param milliseconds
     *            The time in milliseconds.
     * @return String The formatted <code>String</code>
     */
/*
    public format(milliseconds: number): string {
        return this.format(milliseconds);
    }
*/

    /**
     * A method that formats milliseconds into a time format.
     *
     * @param millis
     *            The time in milliseconds.
     * @return String The formatted <code>String</code>
     */
/*
    public format(millis: number): string {
        return format(new Time(millis));
    }
*/

    /**
     * A method that formats {@link Time}objects.
     *
     * @param time
     *            The time <code>Object</code> to be formatted.
     * @return String The formatted <code>String</code>
     */
    public format(time: Time): string;
    public format(millis: number): string;
    public format(timeOrMillis: Time | number): string {
        let time: Time;
        if (timeOrMillis instanceof Time) {
            time = timeOrMillis as Time;
        } else {
            time = new Time(timeOrMillis as number);
        }

        if (this.timeFormat === ZmanimFormatter.XSD_DURATION_FORMAT) {
            return ZmanimFormatter.formatXSDDurationTime(time);
        }
        const sb: StringBuffer = new StringBuffer();
        sb.append(this.hourNF.format(time.getHours()));
        sb.append(":");
        sb.append(ZmanimFormatter.minuteSecondNF.format(time.getMinutes()).toString());
        if (this.useSeconds) {
            sb.append(":");
            sb.append(ZmanimFormatter.minuteSecondNF.format(time.getSeconds()).toString());
        }
        if (this.useMillis) {
            sb.append(".");
            sb.append(ZmanimFormatter.milliNF.format(time.getMilliseconds()).toString());
        }
        return sb.toString();
    }

    /**
     * Formats a date using this classe's {@link #getDateFormat() date format}.
     *
     * @param dateTime
     *            the date to format
     * @param calendar
     *            the {@link java.util.Calendar Calendar} used to help format based on the Calendar's DST and other
     *            settings.
     * @return the formatted String
     */
    public formatDateTime(dateTime: Date, calendar: GregorianCalendar): string {
        this.dateFormat.setCalendar(calendar);
        if (this.dateFormat.toPattern() === "yyyy-MM-dd'T'HH:mm:ss") {
            return this.getXSDateTime(dateTime, calendar);
        } else {
            return this.dateFormat.format(dateTime);
        }

    }

    /**
     * The date:date-time function returns the current date and time as a date/time string. The date/time string that's
     * returned must be a string in the format defined as the lexical representation of xs:dateTime in <a
     * href="http://www.w3.org/TR/xmlschema11-2/#dateTime">[3.3.8 dateTime]</a> of <a
     * href="http://www.w3.org/TR/xmlschema11-2/">[XML Schema 1.1 Part 2: Datatypes]</a>. The date/time format is
     * basically CCYY-MM-DDThh:mm:ss, although implementers should consult <a
     * href="http://www.w3.org/TR/xmlschema11-2/">[XML Schema 1.1 Part 2: Datatypes]</a> and <a
     * href="http://www.iso.ch/markete/8601.pdf">[ISO 8601]</a> for details. The date/time string format must include a
     * time zone, either a Z to indicate Coordinated Universal Time or a + or - followed by the difference between the
     * difference from UTC represented as hh:mm.
     * @param dateTime the Date Object
     * @param calendar Calendar Object
     * @return the XSD dateTime
     */
    public getXSDateTime(dateTime: Date, calendar: GregorianCalendar): string {
        const xsdDateTimeFormat: string = "yyyy-MM-dd'T'HH:mm:ss";
        /*
         * if (xmlDateFormat == null || xmlDateFormat.trim().equals("")) { xmlDateFormat = xsdDateTimeFormat; }
         */
        const dateFormat: SimpleDateFormat = new SimpleDateFormat(xsdDateTimeFormat);
        dateFormat.setTimeZone(this.getTimeZone());

        const sb: StringBuffer = new StringBuffer(dateFormat.format(dateTime));
        // Must also include offset from UTF.
        const offset: number = calendar.get(Calendar.ZONE_OFFSET) + calendar.get(Calendar.DST_OFFSET); // Get the offset (in milliseconds)
        // If there is no offset, we have "Coordinated Universal Time"
        if (offset === 0) {
            sb.append("Z");
        } else {
            // Convert milliseconds to hours and minutes
            const hrs: number = offset / (60 * 60 * 1000);
            // In a few cases, the time zone may be +/-hh:30.
            const min: number = offset % (60 * 60 * 1000);
            const posneg: string = hrs < 0 ? "-" : "+";
            sb.append(posneg + ZmanimFormatter.formatDigits(hrs) + ":" + ZmanimFormatter.formatDigits(min));
        }
        return sb.toString();
    }

    /**
     * Represent the hours and minutes with two-digit strings.
     *
     * @param digits
     *            hours or minutes.
     * @return two-digit String representation of hrs or minutes.
     */
    private static formatDigits(digits: number): string {
        const dd: string = Math.abs(digits).toString();
        return dd.length === 1 ? "0" + dd : dd;
    }

    /**
     * This returns the xml representation of an xsd:duration object.
     *
     * @param millis
     *            the duration in milliseconds
     * @return the xsd:duration formatted String
     */
/*
    public formatXSDDurationTime(millis: number): string {
        return formatXSDDurationTime(new Time(millis));
    }
*/

    /**
     * This returns the xml representation of an xsd:duration object.
     *
     * @param time
     *            the duration as a Time object
     * @return the xsd:duration formatted String
     */
    public static formatXSDDurationTime(time: Time): string;
    public static formatXSDDurationTime(millis: number): string;
    public static formatXSDDurationTime(timeOrMillis: Time | number): string {
        let time: Time;
        if (timeOrMillis instanceof Time) {
            time = timeOrMillis as Time;
        } else {
            time = new Time(timeOrMillis as number);
        }

        const duration: StringBuffer = new StringBuffer();
        if (time.getHours() !== 0 || time.getMinutes() !== 0 || time.getSeconds() !== 0 || time.getMilliseconds() !== 0) {
            duration.append("P");
            duration.append("T");

            if (time.getHours() !== 0) duration.append(time.getHours() + "H");

            if (time.getMinutes() !== 0) duration.append(time.getMinutes() + "M");

            if (time.getSeconds() !== 0 || time.getMilliseconds() !== 0) {
                duration.append(time.getSeconds() + "." + ZmanimFormatter.milliNF.format(time.getMilliseconds()));
                duration.append("S");
            }

            if (duration.length() === 1) duration.append("T0S"); // zero seconds

            if (time.isNegative()) duration.insert(0, "-");
        }
        return duration.toString();
    }

    /**
     * A method that returns an XML formatted <code>String</code> representing the serialized <code>Object</code>. The
     * format used is:
     *
     * <pre>
     *  &lt;AstronomicalTimes date=&quot;1969-02-08&quot; type=&quot;net.sourceforge.zmanim.AstronomicalCalendar algorithm=&quot;US Naval Almanac Algorithm&quot; location=&quot;Lakewood, NJ&quot; latitude=&quot;40.095965&quot; longitude=&quot;-74.22213&quot; elevation=&quot;31.0&quot; timeZoneName=&quot;Eastern Standard Time&quot; timeZoneID=&quot;America/New_York&quot; timeZoneOffset=&quot;-5&quot;&gt;
     *     &lt;Sunrise&gt;2007-02-18T06:45:27-05:00&lt;/Sunrise&gt;
     *     &lt;TemporalHour&gt;PT54M17.529S&lt;/TemporalHour&gt;
     *     ...
     *   &lt;/AstronomicalTimes&gt;
     * </pre>
     *
     * Note that the output uses the <a href="http://www.w3.org/TR/xmlschema11-2/#dateTime">xsd:dateTime</a> format for
     * times such as sunrise, and <a href="http://www.w3.org/TR/xmlschema11-2/#duration">xsd:duration</a> format for
     * times that are a duration such as the length of a
     * {@link net.sourceforge.zmanim.AstronomicalCalendar#getTemporalHour() temporal hour}. The output of this method is
     * returned by the {@link #toString() toString}.
     *
     * @param astronomicalCalendar the AstronomicalCalendar Object
     *
     * @return The XML formatted <code>String</code>. The format will be:
     *
     *         <pre>
     *  &lt;AstronomicalTimes date=&quot;1969-02-08&quot; type=&quot;net.sourceforge.zmanim.AstronomicalCalendar algorithm=&quot;US Naval Almanac Algorithm&quot; location=&quot;Lakewood, NJ&quot; latitude=&quot;40.095965&quot; longitude=&quot;-74.22213&quot; elevation=&quot;31.0&quot; timeZoneName=&quot;Eastern Standard Time&quot; timeZoneID=&quot;America/New_York&quot; timeZoneOffset=&quot;-5&quot;&gt;
     *     &lt;Sunrise&gt;2007-02-18T06:45:27-05:00&lt;/Sunrise&gt;
     *     &lt;TemporalHour&gt;PT54M17.529S&lt;/TemporalHour&gt;
     *     ...
     *  &lt;/AstronomicalTimes&gt;
     * </pre>
     *
     *         TODO: add proper schema, and support for nulls. XSD duration (for solar hours), should probably return
     *         nil and not P
     */
/*
    public static toXML(astronomicalCalendar: AstronomicalCalendar): string {
        const formatter: ZmanimFormatter = new ZmanimFormatter(ZmanimFormatter.XSD_DURATION_FORMAT, new SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss"), astronomicalCalendar.getGeoLocation().getTimeZone());
        const df: DateFormat = new SimpleDateFormat("yyyy-MM-dd");
        df.setTimeZone(astronomicalCalendar.getGeoLocation().getTimeZone());

        const sb: StringBuffer = new StringBuffer("<");
        if (astronomicalCalendar instanceof AstronomicalCalendar) {
            sb.append("AstronomicalTimes");
            // TODO: use proper schema ref, and maybe build a real schema.
            // output += "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ";
            // output += xsi:schemaLocation="http://www.kosherjava.com/zmanim astronomical.xsd"
        } else if (astronomicalCalendar instanceof ComplexZmanimCalendar) {
            sb.append("Zmanim");
            // TODO: use proper schema ref, and maybe build a real schema.
            // output += "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ";
            // output += xsi:schemaLocation="http://www.kosherjava.com/zmanim zmanim.xsd"
        } else if (astronomicalCalendar instanceof ZmanimCalendar) {
            sb.append("BasicZmanim");
            // TODO: use proper schema ref, and maybe build a real schema.
            // output += "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ";
            // output += xsi:schemaLocation="http://www.kosherjava.com/zmanim basicZmanim.xsd"
        }
        sb.append(" date=\"").append(df.format(astronomicalCalendar.getCalendar().getTime())).append("\"");
        sb.append(" type=\"").append(astronomicalCalendar.getClass().getName()).append("\"");
        sb.append(" algorithm=\"").append(astronomicalCalendar.getAstronomicalCalculator().getCalculatorName()).append("\"");
        sb.append(" location=\"").append(astronomicalCalendar.getGeoLocation().getLocationName()).append("\"");
        sb.append(" latitude=\"").append(astronomicalCalendar.getGeoLocation().getLatitude().toString()).append("\"");
        sb.append(" longitude=\"").append(astronomicalCalendar.getGeoLocation().getLongitude().toString()).append("\"");
        sb.append(" elevation=\"").append(astronomicalCalendar.getGeoLocation().getElevation().toString()).append("\"");
        sb.append(" timeZoneName=\"").append(astronomicalCalendar.getGeoLocation().getTimeZone().getDisplayName()).append("\"");
        sb.append(" timeZoneID=\"").append(astronomicalCalendar.getGeoLocation().getTimeZone().getID()).append("\"");
        sb.append(" timeZoneOffset=\"");
        sb.append((astronomicalCalendar.getGeoLocation().getTimeZone().getOffset(astronomicalCalendar.getCalendar().getTimeInMillis()) / ZmanimFormatter.HOUR_MILLIS).toString());
        sb.append("\"");

        sb.append(">\n");

        Method[] theMethods = astronomicalCalendar.getClass().getMethods();
        String tagName = "";
        Object value = null;
        List<Zman> dateList = new ArrayList<Zman>();
        List<Zman> durationList = new ArrayList<Zman>();
        List<String> otherList = new ArrayList<String>();
        for (let i: number = 0; i < theMethods.length; i++) {
            if (includeMethod(theMethods[i])) {
                tagName = theMethods[i].getName().substring(3);
                // String returnType = theMethods[i].getReturnType().getName();
                try {
                    value = theMethods[i].invoke(astronomicalCalendar, (Object[]) null);
                    if (value === null) {// TODO: Consider using reflection to determine the return type, not the value
                        otherList.add("<" + tagName + ">N/A</" + tagName + ">");
                        // TODO: instead of N/A, consider return proper xs:nil.
                        // otherList.add("<" + tagName + " xs:nil=\"true\" />");
                    } else if (value instanceof Date) {
                        dateList.add(new Zman((Date) value, tagName));
                    } else if (value instanceof Long || value instanceof Integer) {// shaah zmanis
                        if (((Long) value).longValue() === Long.MIN_VALUE) {
                            otherList.add("<" + tagName + ">N/A</" + tagName + ">");
                            // TODO: instead of N/A, consider return proper xs:nil.
                            // otherList.add("<" + tagName + " xs:nil=\"true\" />");
                        } else {
                            durationList.add(new Zman((int) ((Long) value).longValue(), tagName));
                        }
                    } else { // will probably never enter this block, but is present to be future proof
                        otherList.add("<" + tagName + ">" + value + "</" + tagName + ">");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        let zman: Zman;
        Collections.sort(dateList, Zman.DATE_ORDER);

        for (let i: number = 0; i < dateList.size(); i++) {
            zman = (Zman) dateList.get(i);
            sb.append("\t<").append(zman.getZmanLabel()).append(">");
            sb.append(formatter.formatDateTime(zman.getZman(), astronomicalCalendar.getCalendar()));
            sb.append("</").append(zman.getZmanLabel()).append(">\n");
        }
        Collections.sort(durationList, Zman.DURATION_ORDER);
        for (let i: number = 0; i < durationList.size(); i++) {
            zman = (Zman) durationList.get(i);
            sb.append("\t<" + zman.getZmanLabel()).append(">");
            sb.append(formatter.format((int) zman.getDuration())).append("</").append(zman.getZmanLabel())
                    .append(">\n");
        }

        for (let i: number = 0; i < otherList.size(); i++) {// will probably never enter this block
            sb.append("\t").append(otherList.get(i)).append("\n");
        }

        if (astronomicalCalendar instanceof AstronomicalCalendar) {
            sb.append("</AstronomicalTimes>");
        } else if (astronomicalCalendar instanceof ComplexZmanimCalendar) {
            sb.append("</Zmanim>");
        } else if (astronomicalCalendar instanceof ZmanimCalendar) {
            sb.append("</Basic>");
        }
        return sb.toString();
    }
*/

    /**
     * A method that returns a JSON formatted <code>String</code> representing the serialized <code>Object</code>. The
     * format used is:
     * <pre>
     * {
     *    &quot;metadata&quot;:{
     *      &quot;date&quot;:&quot;1969-02-08&quot;,
     *      &quot;type&quot;:&quot;net.sourceforge.zmanim.AstronomicalCalendar&quot;,
     *      &quot;algorithm&quot;:&quot;US Naval Almanac Algorithm&quot;,
     *      &quot;location&quot;:&quot;Lakewood, NJ&quot;,
     *      &quot;latitude&quot;:&quot;40.095965&quot;,
     *      &quot;longitude&quot;:&quot;-74.22213&quot;,
     *      &quot;elevation:&quot;31.0&quot;,
     *      &quot;timeZoneName&quot;:&quot;Eastern Standard Time&quot;,
     *      &quot;timeZoneID&quot;:&quot;America/New_York&quot;,
     *      &quot;timeZoneOffset&quot;:&quot;-5&quot;},
     *    &quot;AstronomicalTimes&quot;:{
     *     &quot;Sunrise&quot;:&quot;2007-02-18T06:45:27-05:00&quot;,
     *     &quot;TemporalHour&quot;:&quot;PT54M17.529S&quot;
     *     ...
     *     }
     * }
     * </pre>
     *
     * Note that the output uses the <a href="http://www.w3.org/TR/xmlschema11-2/#dateTime">xsd:dateTime</a> format for
     * times such as sunrise, and <a href="http://www.w3.org/TR/xmlschema11-2/#duration">xsd:duration</a> format for
     * times that are a duration such as the length of a
     * {@link net.sourceforge.zmanim.AstronomicalCalendar#getTemporalHour() temporal hour}.
     *
     * @param astronomicalCalendar the AstronomicalCalendar Object
     *
     * @return The JSON formatted <code>String</code>. The format will be:
     * <pre>
     * {
     *    &quot;metadata&quot;:{
     *      &quot;date&quot;:&quot;1969-02-08&quot;,
     *      &quot;type&quot;:&quot;net.sourceforge.zmanim.AstronomicalCalendar&quot;,
     *      &quot;algorithm&quot;:&quot;US Naval Almanac Algorithm&quot;,
     *      &quot;location&quot;:&quot;Lakewood, NJ&quot;,
     *      &quot;latitude&quot;:&quot;40.095965&quot;,
     *      &quot;longitude&quot;:&quot;-74.22213&quot;,
     *      &quot;elevation:&quot;31.0&quot;,
     *      &quot;timeZoneName&quot;:&quot;Eastern Standard Time&quot;,
     *      &quot;timeZoneID&quot;:&quot;America/New_York&quot;,
     *      &quot;timeZoneOffset&quot;:&quot;-5&quot;},
     *    &quot;AstronomicalTimes&quot;:{
     *     &quot;Sunrise&quot;:&quot;2007-02-18T06:45:27-05:00&quot;,
     *     &quot;TemporalHour&quot;:&quot;PT54M17.529S&quot;
     *     ...
     *     }
     * }
     * </pre>
     */
    public static toJSON(astronomicalCalendar: AstronomicalCalendar): JsonOutput {
        /*
            const formatter: ZmanimFormatter = new ZmanimFormatter(ZmanimFormatter.XSD_DURATION_FORMAT, new SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss"), astronomicalCalendar.getGeoLocation().getTimeZone());
                const df: DateFormat = new SimpleDateFormat("yyyy-MM-dd");
                df.setTimeZone(astronomicalCalendar.getGeoLocation().getTimeZone());
        */
        const formatter: ZmanimFormatter = new ZmanimFormatter(ZmanimFormatter.XSD_DURATION_FORMAT, new SimpleDateFormat(
            "YYYY-MM-DD[T]HH:mm:ss"), astronomicalCalendar.getGeoLocation().getTimeZone());

        const df: SimpleDateFormat = new SimpleDateFormat("YYYY-MM-DD");
        df.setTimeZone(astronomicalCalendar.getGeoLocation().getTimeZone());

        const metadata: JsonOutputMetadata = {
            date: df.format(astronomicalCalendar.getCalendar().getTime()),
            type: astronomicalCalendar.getClass().getName(),
            algorithm: astronomicalCalendar.getAstronomicalCalculator().getCalculatorName(),
            location: astronomicalCalendar.getGeoLocation().getLocationName(),
            latitude: astronomicalCalendar.getGeoLocation().getLatitude(),
            longitude: astronomicalCalendar.getGeoLocation().getLongitude(),
            elevation: astronomicalCalendar.getGeoLocation().getElevation(),
            timeZoneName: astronomicalCalendar.getGeoLocation().getTimeZone().getDisplayName(),
            timeZoneID: astronomicalCalendar.getGeoLocation().getTimeZone().getID(),
            timeZoneOffset: astronomicalCalendar.getGeoLocation().getTimeZone().getOffset(astronomicalCalendar.getCalendar().getTimeInMillis()) / ZmanimFormatter.HOUR_MILLIS,
        };

        let key: string;
        switch (true) {
            case astronomicalCalendar instanceof ComplexZmanimCalendar:
                key = "Zmanim";
                break;
            case astronomicalCalendar instanceof ZmanimCalendar:
                key = "BasicZmanim";
                break;
            case astronomicalCalendar instanceof AstronomicalCalendar:
                key = "AstronomicalTimes";
                break;
        }

        /*
            let dateList: Set<Date> = new Set();
            let durationList: Set<number> = new Set();
        */
        let dateList: Array<Zman> = [];
        let durationList: Array<Zman> = [];

        // Get al the methods in the calendar
        Utils.getAllMethodNames(astronomicalCalendar, true)
            // Filter out methods with parameters
            .filter(method => astronomicalCalendar[method].length === 0)
            // Filter out methods that don't start with "get"
            .filter(method => method.startsWith("get"))
            // Call each method and get the return values
            .map(method => ({methodName: method, value: astronomicalCalendar[method].call(astronomicalCalendar)}))
            // Filter for return values of type Date or number
            .filter(methodObj => methodObj.value instanceof Date || typeof methodObj.value === "number")
            // Separate the Dates and numbers
            .forEach(methodObj => {
                const tagName: string = methodObj.methodName.substring(3);
                if (methodObj.value instanceof Date) {
                    // dateList.add(new KosherZmanim.Zman(methodObj.value, tagName));
                    dateList = dateList.concat(new Zman(methodObj.value as Date, tagName));
                } else if (typeof methodObj.value === "number") {
                    // durationList.add(new KosherZmanim.Zman(methodObj.value, tagName));
                    durationList = durationList.concat(new Zman(methodObj.value as number, tagName));
                }
            });

        dateList.sort(Zman.DATE_ORDER.compare);
        // Filter for values in milliseconds, and not values in minutes
        durationList = durationList.filter((zman: Zman) => zman.getDuration() > 1000)
            .sort(Zman.DURATION_ORDER.compare);

        const timesData: object = {};
        dateList.forEach((zman: Zman) => {
            timesData[zman.getZmanLabel()] = formatter.formatDateTime(zman.getZman(), astronomicalCalendar.getCalendar());
        });
        durationList.forEach((zman: Zman) => {
            timesData[zman.getZmanLabel()] = formatter.format(Math.floor(zman.getDuration()));
        });

        const json: JsonOutput = {
            metadata: metadata
        };
        json[key] = timesData;

        return json;
    }
}
