import * as dayjs from 'dayjs';
import * as fs from 'fs';
import { join } from 'path';

import { LogLevel } from '@common/enums';

const deleteFiles = (expired: any): void => {
  const path = './';

  fs.readdir(path, (err, items) => {
    if (err) console.log('#utils/index - deleteFiles() - error: ' + err);
    else {
      const n = new Date();
      const now = dayjs(new Date(n.getFullYear(), n.getMonth(), n.getDate()));

      for (let i = 0; i < items.length; i++) {
        const filename = path + '/' + items[i];

        fs.stat(filename, (err, stats) => {
          if (err) {
            console.log('#utils/index - deleteFiles() - error: ' + err);
            return;
          }

          const c = new Date(stats['ctime']);
          const created = dayjs(
            new Date(c.getFullYear(), c.getMonth(), c.getDate()),
          );

          const duration = dayjs().minute(now.diff(created, 'days', true));
          const days = duration.daysInMonth;

          if (days >= expired) {
            fs.unlink(filename, (err) => {
              console.log('#utils/index - readFile() - error: ' + err);
            });
          }
        });
      }
    }
  });
};

export const readFile = (path: string): Promise<any> =>
  new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(path);
      console.log('#utils/log - readFile() - log: ' + data);
      return resolve(data);
    } catch (err) {
      console.log('#utils/log - readFile() - error: ' + err);
      return reject(err);
    }
  });

export const writeFile = (level = LogLevel.ERROR, data: string): void => {
  const now = dayjs().format('YYYYMMDD');

  const currentYear = dayjs().year();

  const currentMonth = dayjs().month() + 1;

  const currentDate = dayjs().format('DD-MM-YYYY');

  const levelLocation = join(__dirname, `../../../logs/${level.toLowerCase()}`);

  const yearLocation = join(levelLocation, currentYear.toString());

  const monthLocation = join(yearLocation, currentMonth.toString());

  const dateLocation = join(monthLocation, currentDate);

  if (!fs.existsSync(levelLocation)) {
    fs.mkdirSync(levelLocation, { recursive: true });
  }

  if (!fs.existsSync(dateLocation)) {
    fs.mkdirSync(dateLocation, { recursive: true });
  }

  const path = join(dateLocation, `${now}.lg`);

  if (fs.existsSync(path)) {
    // Append new data into log file!
    fs.appendFileSync(path, data);
  } else {
    // Delete old files in log directory!
    deleteFiles(31);

    // Create a new log file!
    fs.writeFileSync(path, data);
  }
};
