--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: contact_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contact_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DECLINED',
    'BLOCKED'
);


ALTER TYPE public.contact_status OWNER TO postgres;

--
-- Name: group_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.group_type AS ENUM (
    'GENERAL',
    'TRIP',
    'ROOMMATE',
    'WORK',
    'FAMILY',
    'EVENT',
    'OTHER'
);


ALTER TYPE public.group_type OWNER TO postgres;

--
-- Name: privacy_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.privacy_level AS ENUM (
    'PUBLIC',
    'PRIVATE',
    'INVITE_ONLY'
);


ALTER TYPE public.privacy_level OWNER TO postgres;

--
-- Name: relationship_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.relationship_type AS ENUM (
    'FRIEND',
    'FAMILY',
    'COLLEAGUE',
    'ROOMMATE',
    'OTHER'
);


ALTER TYPE public.relationship_type OWNER TO postgres;

--
-- Name: update_contact_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_contact_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_contact_updated_at() OWNER TO postgres;

--
-- Name: update_group_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_group_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_group_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    contact_user_id bigint,
    contact_name character varying(100),
    contact_email character varying(255),
    contact_phone character varying(20),
    status public.contact_status DEFAULT 'PENDING'::public.contact_status,
    relationship_type public.relationship_type DEFAULT 'FRIEND'::public.relationship_type,
    is_blocked boolean DEFAULT false,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact OWNER TO postgres;

--
-- Name: TABLE contact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contact IS 'Contacts/friends system for user relationships';


--
-- Name: COLUMN contact.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.id IS 'Primary key';


--
-- Name: COLUMN contact.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.user_id IS 'Owner of the contact list';


--
-- Name: COLUMN contact.contact_user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.contact_user_id IS 'User being added as contact (if registered)';


--
-- Name: COLUMN contact.contact_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.contact_name IS 'Display name for the contact';


--
-- Name: COLUMN contact.contact_email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.contact_email IS 'Email address of the contact';


--
-- Name: COLUMN contact.contact_phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.contact_phone IS 'Phone number of the contact';


--
-- Name: COLUMN contact.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.status IS 'Current status of the contact relationship';


--
-- Name: COLUMN contact.relationship_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.relationship_type IS 'Type of relationship with the contact';


--
-- Name: COLUMN contact.is_blocked; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.is_blocked IS 'Whether the contact is blocked';


--
-- Name: COLUMN contact.added_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.added_at IS 'When the contact was added';


--
-- Name: COLUMN contact.updated_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact.updated_at IS 'When the contact was last updated';


--
-- Name: contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_id_seq OWNER TO postgres;

--
-- Name: contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id bigint NOT NULL,
    added_at timestamp(6) without time zone,
    contact_email character varying(255),
    contact_name character varying(255),
    contact_phone character varying(255),
    is_blocked boolean,
    relationship_type character varying(255),
    status character varying(255),
    updated_at timestamp(6) without time zone,
    contact_user_id bigint,
    user_id bigint NOT NULL,
    CONSTRAINT contacts_relationship_type_check CHECK (((relationship_type)::text = ANY ((ARRAY['FRIEND'::character varying, 'FAMILY'::character varying, 'COLLEAGUE'::character varying, 'ROOMMATE'::character varying, 'OTHER'::character varying])::text[]))),
    CONSTRAINT contacts_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'DECLINED'::character varying, 'BLOCKED'::character varying])::text[])))
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: expense_shares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_shares (
    id bigint NOT NULL,
    amount numeric(38,2),
    percentage numeric(38,2),
    expense_id bigint,
    user_id bigint
);


ALTER TABLE public.expense_shares OWNER TO postgres;

--
-- Name: expense_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expense_shares_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_shares_id_seq OWNER TO postgres;

--
-- Name: expense_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expense_shares_id_seq OWNED BY public.expense_shares.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id bigint NOT NULL,
    amount numeric(38,2),
    created_at timestamp(6) without time zone,
    date timestamp(6) without time zone,
    description character varying(255),
    split_type character varying(255),
    updated_at timestamp(6) without time zone,
    group_id bigint,
    paid_by bigint,
    CONSTRAINT expenses_split_type_check CHECK (((split_type)::text = ANY ((ARRAY['EQUAL'::character varying, 'PERCENTAGE'::character varying, 'CUSTOM'::character varying])::text[])))
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: group_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_members (
    group_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.group_members OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    description character varying(255),
    name character varying(255),
    updated_at timestamp(6) without time zone,
    created_by bigint,
    icon_url character varying(500),
    icon_name character varying(100) DEFAULT 'fas fa-users'::character varying,
    cover_image_url character varying(500),
    default_currency character varying(3) DEFAULT 'USD'::character varying,
    group_type public.group_type DEFAULT 'GENERAL'::public.group_type,
    privacy_level public.privacy_level DEFAULT 'PRIVATE'::public.privacy_level,
    is_active boolean DEFAULT true,
    is_archived boolean DEFAULT false,
    simplify_debts boolean DEFAULT true,
    auto_settle boolean DEFAULT false,
    allow_member_add_expense boolean DEFAULT true,
    allow_member_edit_expense boolean DEFAULT false,
    require_approval_for_expense boolean DEFAULT false,
    notification_enabled boolean DEFAULT true
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: COLUMN groups.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.created_at IS 'Group creation timestamp';


--
-- Name: COLUMN groups.updated_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.updated_at IS 'Last update timestamp';


--
-- Name: COLUMN groups.icon_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.icon_url IS 'URL to group icon image';


--
-- Name: COLUMN groups.icon_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.icon_name IS 'FontAwesome icon name for the group';


--
-- Name: COLUMN groups.cover_image_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.cover_image_url IS 'URL to group cover image';


--
-- Name: COLUMN groups.default_currency; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.default_currency IS 'Default currency for the group (ISO 4217)';


--
-- Name: COLUMN groups.group_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.group_type IS 'Type/category of the group';


--
-- Name: COLUMN groups.privacy_level; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.privacy_level IS 'Privacy setting for the group';


--
-- Name: COLUMN groups.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.is_active IS 'Whether the group is active';


--
-- Name: COLUMN groups.is_archived; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.is_archived IS 'Whether the group is archived';


--
-- Name: COLUMN groups.simplify_debts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.simplify_debts IS 'Enable debt simplification algorithm';


--
-- Name: COLUMN groups.auto_settle; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.auto_settle IS 'Enable automatic settlement suggestions';


--
-- Name: COLUMN groups.allow_member_add_expense; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.allow_member_add_expense IS 'Allow members to add expenses';


--
-- Name: COLUMN groups.allow_member_edit_expense; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.allow_member_edit_expense IS 'Allow members to edit expenses';


--
-- Name: COLUMN groups.require_approval_for_expense; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.require_approval_for_expense IS 'Require admin approval for expenses';


--
-- Name: COLUMN groups.notification_enabled; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.notification_enabled IS 'Enable group notifications';


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    password character varying(255),
    username character varying(255),
    avatar_url character varying(500),
    phone character varying(20),
    default_currency character varying(3) DEFAULT 'USD'::character varying,
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    language character varying(10) DEFAULT 'en'::character varying,
    email_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    expense_notifications boolean DEFAULT true,
    settlement_notifications boolean DEFAULT true,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    two_factor_enabled boolean DEFAULT false,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: COLUMN users.avatar_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.avatar_url IS 'URL to user profile picture';


--
-- Name: COLUMN users.phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.phone IS 'User phone number';


--
-- Name: COLUMN users.default_currency; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.default_currency IS 'User preferred currency (ISO 4217)';


--
-- Name: COLUMN users.timezone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.timezone IS 'User timezone (IANA format)';


--
-- Name: COLUMN users.language; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.language IS 'User preferred language (ISO 639-1)';


--
-- Name: COLUMN users.email_notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.email_notifications IS 'Enable email notifications';


--
-- Name: COLUMN users.push_notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.push_notifications IS 'Enable push notifications';


--
-- Name: COLUMN users.expense_notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.expense_notifications IS 'Enable expense-related notifications';


--
-- Name: COLUMN users.settlement_notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.settlement_notifications IS 'Enable settlement notifications';


--
-- Name: COLUMN users.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.is_active IS 'Account active status';


--
-- Name: COLUMN users.is_verified; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.is_verified IS 'Email verification status';


--
-- Name: COLUMN users.two_factor_enabled; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.two_factor_enabled IS '2FA enabled status';


--
-- Name: COLUMN users.last_login; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.last_login IS 'Last login timestamp';


--
-- Name: COLUMN users.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.created_at IS 'Account creation timestamp';


--
-- Name: COLUMN users.updated_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.updated_at IS 'Last update timestamp';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: contact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: expense_shares id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_shares ALTER COLUMN id SET DEFAULT nextval('public.expense_shares_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact (id, user_id, contact_user_id, contact_name, contact_email, contact_phone, status, relationship_type, is_blocked, added_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, added_at, contact_email, contact_name, contact_phone, is_blocked, relationship_type, status, updated_at, contact_user_id, user_id) FROM stdin;
\.


--
-- Data for Name: expense_shares; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_shares (id, amount, percentage, expense_id, user_id) FROM stdin;
1	50.00	\N	7	1
2	50.00	\N	8	1
5	25.50	\N	11	2
6	15.00	\N	13	1
7	45.00	\N	14	1
9	95.00	\N	18	1
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, amount, created_at, date, description, split_type, updated_at, group_id, paid_by) FROM stdin;
7	50.00	2025-08-14 10:06:52.533167	2025-08-14 10:06:52.533159	Test Expense	EQUAL	2025-08-14 10:06:52.533168	1	1
8	50.00	2025-08-14 10:09:54.695249	2025-08-14 10:09:54.695232	Test Expense	EQUAL	2025-08-14 10:09:54.695251	1	1
11	25.50	2025-08-14 10:13:47.745754	2025-08-14 10:13:47.745744	Frontend Test Expense	EQUAL	2025-08-14 10:13:47.745755	2	2
13	15.00	2025-08-14 10:27:29.776454	2025-08-14 10:27:29.776444	gas bill	EQUAL	2025-08-14 10:27:29.776458	1	1
14	45.00	2025-08-14 10:31:51.358953	2025-08-14 10:31:51.358931	gas bill	EQUAL	2025-08-14 10:31:51.358954	3	1
18	95.00	2025-08-14 10:58:21.470182	2025-08-14 10:58:21.47016	pizza pizaa 	EQUAL	2025-08-14 10:58:21.470185	4	1
\.


--
-- Data for Name: group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_members (group_id, user_id) FROM stdin;
1	1
2	2
3	1
4	1
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, created_at, description, name, updated_at, created_by, icon_url, icon_name, cover_image_url, default_currency, group_type, privacy_level, is_active, is_archived, simplify_debts, auto_settle, allow_member_add_expense, allow_member_edit_expense, require_approval_for_expense, notification_enabled) FROM stdin;
1	2025-08-14 09:59:51.016181	Testing with update mode	Test Group 4	2025-08-14 09:59:51.016195	1	\N	fas fa-users	\N	USD	GENERAL	PRIVATE	t	f	t	f	t	f	f	t
2	2025-08-14 10:03:59.987481	Testing the complete flow	Frontend Test Group 2	2025-08-14 10:03:59.987498	2	\N	fas fa-users	\N	USD	GENERAL	PRIVATE	t	f	t	f	t	f	f	t
3	2025-08-14 10:04:57.535969	home group	My Group	2025-08-14 10:04:57.535985	1	\N	fas fa-users	\N	USD	GENERAL	PRIVATE	t	f	t	f	t	f	f	t
4	2025-08-14 10:57:46.775867	For college friends expenses	College Group	2025-08-14 10:57:46.775876	1	\N	fas fa-users	\N	USD	GENERAL	PRIVATE	t	f	t	f	t	f	f	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, password, username, avatar_url, phone, default_currency, timezone, language, email_notifications, push_notifications, expense_notifications, settlement_notifications, is_active, is_verified, two_factor_enabled, last_login, created_at, updated_at) FROM stdin;
1	test3@example.com	Test	User3	$2a$10$PJqFezo.bRVe6NqW87XNCu5kEl0GAr9M5jA9SL2gV2AtRBEtN3OWe	testuser3	\N	\N	USD	UTC	en	t	t	t	t	t	f	f	\N	2025-08-14 19:33:21.990677	2025-08-14 19:33:21.991918
2	frontend2@example.com	Frontend	User2	$2a$10$9w0inZJ5x.wYXKvALToRA.Q7WsUMBYpvMYUnvfFRSCe7GIiLAwKXu	frontenduser2	\N	\N	USD	UTC	en	t	t	t	t	t	f	f	\N	2025-08-14 19:33:21.990677	2025-08-14 19:33:21.991918
3	dhruv03.work@gmail.com	Dhruv	Patel	$2a$10$X4mYNJ.HpB3zLbQ69n3rUucYxgHs74EnZNPfsEBEG6ZFUfF4BOy1.	dhruv3010	\N	\N	USD	UTC	en	t	t	t	t	t	f	f	\N	2025-08-14 19:33:21.990677	2025-08-14 19:33:21.991918
\.


--
-- Name: contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_id_seq', 1, false);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 1, false);


--
-- Name: expense_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_shares_id_seq', 9, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 18, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: contact contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: expense_shares expense_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_shares
    ADD CONSTRAINT expense_shares_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (group_id, user_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: contact uk_contact_user_contact; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT uk_contact_user_contact UNIQUE (user_id, contact_user_id);


--
-- Name: contact uk_contact_user_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT uk_contact_user_email UNIQUE (user_id, contact_email);


--
-- Name: users uk_r43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_contact_added_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_added_at ON public.contact USING btree (added_at);


--
-- Name: idx_contact_contact_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_contact_user_id ON public.contact USING btree (contact_user_id);


--
-- Name: idx_contact_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_email ON public.contact USING btree (contact_email);


--
-- Name: idx_contact_relationship_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_relationship_type ON public.contact USING btree (relationship_type);


--
-- Name: idx_contact_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_status ON public.contact USING btree (status);


--
-- Name: idx_contact_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_user_id ON public.contact USING btree (user_id);


--
-- Name: idx_group_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_created_at ON public.groups USING btree (created_at);


--
-- Name: idx_group_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_created_by ON public.groups USING btree (created_by);


--
-- Name: idx_group_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_is_active ON public.groups USING btree (is_active);


--
-- Name: idx_group_is_archived; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_is_archived ON public.groups USING btree (is_archived);


--
-- Name: idx_group_privacy_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_privacy_level ON public.groups USING btree (privacy_level);


--
-- Name: idx_group_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_type ON public.groups USING btree (group_type);


--
-- Name: idx_user_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_created_at ON public.users USING btree (created_at);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: idx_user_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_is_active ON public.users USING btree (is_active);


--
-- Name: idx_user_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_username ON public.users USING btree (username);


--
-- Name: contact trigger_update_contact_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_contact_updated_at BEFORE UPDATE ON public.contact FOR EACH ROW EXECUTE FUNCTION public.update_contact_updated_at();


--
-- Name: groups trigger_update_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_group_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_group_updated_at();


--
-- Name: contacts fk9mkwspccui92uknc6qnn7yrax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT fk9mkwspccui92uknc6qnn7yrax FOREIGN KEY (contact_user_id) REFERENCES public.users(id);


--
-- Name: contact fk_contact_contact_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT fk_contact_contact_user FOREIGN KEY (contact_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: contact fk_contact_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: expense_shares fkdn6vq7keotg18eshxo5beagf2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_shares
    ADD CONSTRAINT fkdn6vq7keotg18eshxo5beagf2 FOREIGN KEY (expense_id) REFERENCES public.expenses(id);


--
-- Name: expenses fkiwqbj8x69qhvj7a41f5r3xy10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT fkiwqbj8x69qhvj7a41f5r3xy10 FOREIGN KEY (paid_by) REFERENCES public.users(id);


--
-- Name: groups fkkhpvhy2p2c1un4krvhwnau23b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fkkhpvhy2p2c1un4krvhwnau23b FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: group_members fkkv9vlrye4rmhqjq4qohy2n5a6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT fkkv9vlrye4rmhqjq4qohy2n5a6 FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: contacts fkna8bddygr3l3kq1imghgcskt8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT fkna8bddygr3l3kq1imghgcskt8 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: expenses fkne4jfgy6h5e1gv78elj8bypb5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT fkne4jfgy6h5e1gv78elj8bypb5 FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: group_members fknr9qg33qt2ovmv29g4vc3gtdx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT fknr9qg33qt2ovmv29g4vc3gtdx FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: expense_shares fkq4ip0hb9q7ujr7v3jiav4tunp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_shares
    ADD CONSTRAINT fkq4ip0hb9q7ujr7v3jiav4tunp FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

