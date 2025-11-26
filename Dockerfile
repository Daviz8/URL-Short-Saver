###################################################
# Stage: base
###################################################
FROM node:22 AS base
WORKDIR /URL-SHORT-SAVER

################## CLIENT STAGES ##################

###################################################
# Stage: client-base
###################################################
FROM base AS client-base
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/.eslintrc.cjs client/index.html client/vite.config.js ./
COPY client/public ./public
COPY client/src ./src

###################################################
# Stage: client-dev
###################################################
FROM client-base AS client-dev
CMD ["npm", "run", "dev"]

###################################################
# Stage: client-build
###################################################
FROM client-base AS client-build
RUN npm run build

################ BACKEND STAGES ##################

###################################################
# Stage: backend-dev
###################################################
FROM base AS backend-dev
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend/spec ./spec
COPY backend/src ./src
CMD ["npm", "run", "dev"]

###################################################
# Stage: test
###################################################
FROM backend-dev AS test
RUN npm run test

###################################################
# Stage: final (production)
###################################################
FROM base AS final
ENV NODE_ENV=production
COPY --from=test /usr/local/app/package.json /usr/local/app/package-lock.json ./
RUN npm ci --production && npm cache clean --force
COPY backend/src ./src
COPY --from=client-build /usr/local/app/dist ./src/static
EXPOSE 3000
CMD ["node", "src/index.js"]
