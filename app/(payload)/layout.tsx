/* THIS FILE WAS WRITTEN FOR PAYLOAD AND SHOULD NOT BE EDITED BY HAND.
 *
 * It is the root layout for the admin panel only. Next allows more than one
 * root layout when each lives in its own top-level branch, which is why this
 * sits in a (payload) route group alongside app/[lang]: the marketing site
 * needs <html lang/dir> set per locale, and the admin needs Payload's own
 * shell. Neither can wrap the other.
 */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap";
import React from "react";

import "@payloadcms/next/css";
/*
 * The Markyos skin. After Payload's own stylesheet, because it re-points
 * Payload's theme variables and has to win. This import is the documented
 * place to add admin CSS, and is the only hand-edit in this file.
 */
import "./custom.css";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
