alter table "User" add column "passwordHash" text;

create table "Session" (
  "id" text primary key,
  "userId" text not null,
  "tokenHash" text not null unique,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  constraint "Session_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade
);

create index "Session_userId_idx" on "Session"("userId");
create index "Session_expiresAt_idx" on "Session"("expiresAt");

alter table "Session" enable row level security;
grant all on table "Session" to service_role;
