import { STATUS_OPTION, USER_ROLE } from "@/constant/option";
import translationData from "@/locales/id.json";
import dayjs from "dayjs";
import { template, crush, first, set } from "radash";
import type { ZodSchema } from "zod";
import { z } from "zod";

export function formatNumber(number: number) {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return formatter.format(number);
}

export const indonesianLocale = new Intl.Locale("id", {
  region: "ID",
  hourCycle: "h24",
  calendar: "gregory",
});

export const translate = (
  key: string,
  templateData: { [key: string]: string } = {}
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return template(crush(translationData)[key], templateData);
};

export const getInitials = (name: string) => {
  const parts = name.split(" ");
  let initials = "";
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== "") {
      initials += parts[i][0];
    }
  }
  return initials.length > 2 ? initials.substring(0, 2) : initials;
};

export const checkRoleAccess = (currentRole: number, roleAccess: number[]) => {
  return roleAccess.includes(currentRole);
};

export function getExtension(filename: string) {
  const parts = filename.split(".");
  return parts[parts.length - 1];
}

export const parseRoleToName = (currentRole: number) => {
  const tempRole = USER_ROLE.filter((value) => {
    return value.value == currentRole;
  });
  const roleName = first(tempRole)?.label;

  return roleName;
};

export const parseStatus = (status: number) => {
  const tempStatus = STATUS_OPTION.filter((value) => {
    return value.value == status;
  });
  const statusName = first(tempStatus)?.label;

  return statusName;
};

export const parseDateLocaled = (date: string) => {
  if (date) {
    const tempDate = dayjs(date);
    return tempDate.format("DD MMMM YYYY");
  }
  return "-";
};
