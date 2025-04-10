import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/en";

// DAYJS CONFIGURATION
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(localizedFormat);
