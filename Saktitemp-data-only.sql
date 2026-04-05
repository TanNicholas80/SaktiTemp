-- =============================================================================
-- Data-only (COPY) diekstrak dari pg_dump — tanpa CREATE/ALTER/FK
-- Sumber: c:\Users\tanni\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm\LocalState\sessions\1361B1805E2B2302C54EE6D80DAB9523BEBD99E2\transfers\2026-14\Saktitemp.sql
-- Tabel: 57 blok COPY
-- =============================================================================
-- PENTING:
-- - Skema/tabel harus sudah ada (jalankan migration Drizzle dulu).
-- - Kosongkan data lama jika perlu (TRUNCATE ... CASCADE) atau restore ke DB baru.
-- - COPY ... FROM stdin paling kompatibel dengan: psql -f file.sql
--   (pgAdmin Query Tool sering tidak mendukung COPY stdin + \\.)
--
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
BEGIN;
SET session_replication_role = replica;

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.

COPY public.account (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) FROM stdin;
84edd3df-74ff-4dd3-acda-949c3299663e	af922b38-7782-41aa-a65e-b781c12a38bb	credential	af922b38-7782-41aa-a65e-b781c12a38bb	\N	\N	\N	\N	\N	\N	3945afc79672d7803ce3010cc7080ecd:53f86579902e18dbce0434ffe4e6a6f3c58c7308b75c19bd5f47203d8b0d063a4a57012b6a458d04b7a68373665553ef9457ec5a9f5e175a21745f49244cbe63	2026-03-08 21:07:03.046182	2026-03-08 21:07:03.046182
\.

COPY public.benefit (benefit_id, benefit_name, benefit_description, benefit_icon, benefit_is_published, created_at, updated_at) FROM stdin;
5e4653f4-b8d3-47da-a41d-8126691f164a	Precision Manufacturing	Jasa pemrosesan tempered glass kami menggunakan teknologi CNC terbaru, menjamin akurasi tinggi pada pemotongan dan pelubangan untuk hasil kaca presisi.	Target	t	2026-03-09 21:24:49.785016	2026-03-09 21:24:49.785016
7951de93-9e6f-4262-9fe4-caff482923ae	Quality Control	Kami menerapkan kontrol ketat dalam layanan tempering, dengan pengujian menyeluruh untuk memastikan kekerasan dan keamanan kaca memenuhi standar keselamatan.	ShieldCheck	t	2026-03-09 21:25:23.847994	2026-03-09 21:25:23.847994
ca492795-ddb6-4609-a731-0f44acf63de8	Reliable Project Partner	Tim profesional kami siap membantu kebutuhan tempered glass Anda, dari konsultasi hingga pengiriman, memastikan material tersedia tepat waktu.	Users	t	2026-03-09 21:25:40.388602	2026-03-09 21:25:40.388602
aaf63359-4ff0-453e-9418-729b45a5012b	Custom Glass Solution	Layanan tempered glass kami fleksibel, menyesuaikan kebutuhan unik Anda dengan ukuran custom dan ketebalan bervariasi, menghasilkan presisi tinggi.	Star	t	2026-03-09 21:26:02.212267	2026-03-09 21:26:02.212267
\.

COPY public.benefit_translations (id, benefit_id, locale, benefit_name, benefit_description) FROM stdin;
54d80b22-296e-4315-9778-140dc9371c2a	5e4653f4-b8d3-47da-a41d-8126691f164a	en	Precision Manufacturing	Our tempered glass processing services utilize the latest CNC technology, ensuring high accuracy in cutting and drilling for precise glass products.
309aac2f-a9a6-4c4f-b859-bb16cd75caa8	5e4653f4-b8d3-47da-a41d-8126691f164a	zh	精密制造	我们的钢化玻璃加工服务采用最新的CNC技术，确保切割和钻孔的高精度，以生产出精密玻璃产品。
411ef7b6-e3b7-4a07-8a4c-9b8ccf7024be	7951de93-9e6f-4262-9fe4-caff482923ae	en	Quality Control	We implement strict controls in our tempering services, with thorough testing to ensure the glass hardness and safety meet safety standards.
aabf5940-e8a3-4478-a262-51db67f462c3	7951de93-9e6f-4262-9fe4-caff482923ae	zh	质量控制	我们在钢化服务中实施严格控制，通过全面测试确保玻璃的硬度和安全性符合安全标准。
b0cf0c69-2f36-46e2-9226-9573d30507f2	ca492795-ddb6-4609-a731-0f44acf63de8	en	Reliable Project Partner	Our professional team is ready to assist with your tempered glass needs, from consultation to delivery, ensuring materials are available on time.
bd638bd6-1448-4633-b398-5e54e6e734fa	ca492795-ddb6-4609-a731-0f44acf63de8	zh	可靠的项目伙伴	我们的专业团队随时准备为您提供钢化玻璃需求方面的帮助，从咨询到交付，确保材料按时到位。
0404d3d0-584e-4a0f-99f4-26ccd60c4036	aaf63359-4ff0-453e-9418-729b45a5012b	en	Custom Glass Solution	Our tempered glass services are flexible, adapting to your unique needs with custom sizes and varying thicknesses, resulting in high precision.
4a217aaa-8f63-489b-a13e-dff66b96b262	aaf63359-4ff0-453e-9418-729b45a5012b	zh	定制玻璃解决方案	我们的钢化玻璃服务灵活多样，能够根据您的独特需求进行调整，提供定制尺寸和不同厚度，确保高精度。
\.

COPY public.blog (blog_id, category_blog_id, blog_title, blog_slug, blog_excerpt, blog_content, blog_image_url, blog_image_public_id, blog_views, blog_is_published, blog_is_published_at, created_at, updated_at) FROM stdin;
0148c61a-c973-4496-971e-8b3d54d6e313	a313dacf-c369-4b91-8529-a3403e2dad1b	Keunggulan Kaca Tempered vs Kaca Biasa: Mana yang Lebih Baik?	keunggulan-kaca-tempered-vs-kaca-biasa-mana-yang-lebih-baik	Perbandingan lengkap antara kaca tempered dan kaca biasa dari segi keamanan, kekuatan, dan aplikasi.	<p><strong>Pendahuluan</strong></p><p>Kaca tempered merupakan salah satu jenis kaca yang paling banyak digunakan dalam industri konstruksi modern. Proses pembuatannya yang khusus memberikan kekuatan hingga 4-5 kali lipat dibandingkan kaca biasa.</p><p></p><p><strong>Tahapan Produksi</strong></p><ul><li><p><strong>Pemilihan Bahan Baku, </strong>Proses dimulai dengan pemilihan kaca float berkualitas tinggi. Kaca harus bebas dari cacat seperti gelembung udara, goresan, atau inklusi partikel asing.</p></li><li><p><strong>Pemotongan dan Penghalusan, </strong>Kaca dipotong sesuai ukuran yang diinginkan menggunakan mesin CNC presisi tinggi. Tepi kaca kemudian dihaluskan (edging) untuk menghilangkan bagian tajam.</p></li><li><p><strong>Proses Pemanasan, </strong>Kaca dipanaskan dalam furnace hingga suhu sekitar 620-680°C. Pada suhu ini, kaca mencapai titik pelunakan namun belum mencair.</p></li><li><p><strong>Pendinginan Cepat (Quenching), </strong>Ini adalah tahap kritis yang memberikan kekuatan pada kaca tempered. Kaca yang dipanaskan didinginkan secara cepat menggunakan jet udara bertekanan tinggi dari kedua sisi.</p></li></ul><p></p>	/uploads/blog/76aee852-6a63-4c0a-9606-eec25dcd5f19.webp	76aee852-6a63-4c0a-9606-eec25dcd5f19.webp	22	t	2026-03-09 12:31:19.409	2026-03-09 19:31:19.409714	2026-04-01 14:04:39.769
\.

COPY public.blog_translations (id, blog_id, locale, blog_title, blog_excerpt, blog_content) FROM stdin;
cc402fbb-c7da-4056-8b32-ab4ac2b2f75d	0148c61a-c973-4496-971e-8b3d54d6e313	en	Advantages of Tempered Glass vs. Regular Glass: Which is Better?	A comprehensive comparison between tempered glass and regular glass in terms of safety, strength, and applications.	<p><strong>Introduction</strong></p><p>Tempered glass is one of the most widely used types of glass in the modern construction industry. Its specialized manufacturing process provides 4-5 times greater strength compared to regular glass.</p><p></p><p><strong>Production Stages</strong></p><ul><li><p><strong>Raw Material Selection, </strong>The process begins with selecting high-quality float glass. The glass must be free from defects such as air bubbles, scratches, or foreign particle inclusions.</p></li><li><p><strong>Cutting and Edging, </strong>The glass is cut to the desired size using high-precision CNC machines. The edges of the glass are then smoothed (edging) to remove sharp parts.</p></li><li><p><strong>Heating Process, </strong>The glass is heated in a furnace to a temperature of approximately 620-680°C. At this temperature, the glass reaches its softening point but has not yet melted.</p></li><li><p><strong>Rapid Cooling (Quenching), </strong>This is a critical stage that provides strength to tempered glass. The heated glass is rapidly cooled using high-pressure air jets from both sides.</p></li></ul><p></p>
b2d2052d-5478-4cf0-95fe-4be594923842	0148c61a-c973-4496-971e-8b3d54d6e313	zh	钢化玻璃与普通玻璃的优势对比：哪个更好？	从安全性、强度和应用方面，对钢化玻璃和普通玻璃进行全面比较。	<p><strong>引言</strong></p><p>钢化玻璃是现代建筑行业中使用最广泛的玻璃类型之一。其特殊的制造工艺使其强度比普通玻璃高出4-5倍。</p><p></p><p><strong>生产阶段</strong></p><ul><li><p><strong>原材料选择, </strong>该过程始于选择高质量的浮法玻璃。玻璃必须没有气泡、划痕或异物夹杂等缺陷。</p></li><li><p><strong>切割和磨边, </strong>玻璃使用高精度数控机床切割成所需尺寸。然后对玻璃边缘进行磨边，以去除尖锐部分。</p></li><li><p><strong>加热过程, </strong>玻璃在炉中加热至约620-680°C的温度。在此温度下，玻璃达到软化点但尚未熔化。</p></li><li><p><strong>快速冷却（淬火）, </strong>这是赋予钢化玻璃强度的关键阶段。加热后的玻璃通过两侧的高压空气喷射快速冷却。</p></li></ul><p></p>
\.

COPY public.carousel (carousel_id, carousel_heading, carousel_subheading, carousel_description, carousel_image_url, carousel_image_public_id, carousel_order, carousel_is_published, created_at, updated_at) FROM stdin;
7de8d2fe-affd-4cb6-853c-0818649099bb	WE UNDERSTAND	Your Vision	Solusi kaca tempered premium untuk proyek komersial & residensial dengan standar kualitas Eropa	/uploads/carousel/6430a305-e965-4fc8-b0ce-fc3a7eb2b478.webp	6430a305-e965-4fc8-b0ce-fc3a7eb2b478.webp	1	t	2026-03-11 19:10:57.911218	2026-03-11 19:10:57.911218
b78c265e-a739-4e4b-90b8-d86d42ecaef1	PRECISION IN	Every Detail	Manufaktur kaca tempered dengan teknologi terkini dan kontrol kualitas ketat	/uploads/carousel/26a56244-ae05-494c-814c-c97ded1954ca.webp	26a56244-ae05-494c-814c-c97ded1954ca.webp	2	t	2026-03-11 19:11:36.464805	2026-03-11 19:11:36.464805
56795d41-e1f7-4357-8b28-56e323765a4e	YOUR TRUSTED	Partner	Manufaktur kaca tempered dengan teknologi terkini dan kontrol kualitas ketat	/uploads/carousel/17e0cd61-504e-4b00-bbd6-06bfbba5c89f.webp	17e0cd61-504e-4b00-bbd6-06bfbba5c89f.webp	3	t	2026-03-11 19:12:42.044944	2026-03-11 19:12:42.044944
\.

COPY public.carousel_translations (id, carousel_id, locale, carousel_heading, carousel_subheading, carousel_description) FROM stdin;
be0fed87-0040-45a1-96cc-19198b9a9dce	7de8d2fe-affd-4cb6-853c-0818649099bb	en	WE UNDERSTAND	Your Vision	Premium tempered glass solutions for commercial & residential projects with European quality standards
2ac9fae1-b086-49a3-b64c-28e078dfa849	7de8d2fe-affd-4cb6-853c-0818649099bb	zh	我们理解	您的愿景	为商业和住宅项目提供符合欧洲质量标准的优质钢化玻璃解决方案
778ad8db-6988-4f23-bd9b-a10e0cfd9ac6	b78c265e-a739-4e4b-90b8-d86d42ecaef1	en	PRECISION IN	Every Detail	Tempered glass manufacturing with the latest technology and strict quality control
c3a82118-c4b4-43a2-af10-cc17e24572c5	b78c265e-a739-4e4b-90b8-d86d42ecaef1	zh	精益求精	于微末处	采用最新技术并实施严格质量控制的钢化玻璃制造
ea93cd85-e751-4649-86e8-c258ac41cc12	56795d41-e1f7-4357-8b28-56e323765a4e	en	YOUR TRUSTED	Partner	Tempered glass manufacturing with the latest technology and strict quality control
6890863a-949b-4d2c-a078-b51c50597998	56795d41-e1f7-4357-8b28-56e323765a4e	zh	您信赖的	合作伙伴	钢化玻璃制造，采用最新技术和严格的质量控制
\.

COPY public."category-blog" (category_blog_id, category_blog_name, category_blog_slug, created_at, updated_at) FROM stdin;
a313dacf-c369-4b91-8529-a3403e2dad1b	Manufacturing	manufacturing	2026-03-08 21:37:55.34107	2026-03-08 21:37:55.34107
7cdd6dfc-e340-4f4a-bd38-fbe59d261a3f	Guide	guide	2026-03-08 21:37:59.618555	2026-03-08 21:37:59.618555
2bb0857a-c85d-48e3-baf4-f654fbcabb12	Trends	trends	2026-03-08 21:38:09.222098	2026-03-08 21:38:09.222098
\.

COPY public."category-portofolio" (category_portofolio_id, category_portofolio_name, category_portofolio_slug, category_portofolio_icon, category_portofolio_image, category_portofolio_description, created_at, updated_at) FROM stdin;
f0f9a822-ce23-45ba-8360-71f2b3c7a4a7	Residential	residential	Home	/uploads/category/af900f2a-b64e-4ce0-8e27-64f3b8df0c31.webp	Rumah tinggal, apartemen, villa	2026-03-09 19:44:31.200681	2026-03-09 19:44:31.200681
7ecb9b48-3adf-4d55-ac3c-063102a78995	Commercial	commercial	Building2	/uploads/category/25aeca1e-3559-407e-a3fb-7f4aa6f73a9a.webp	Gedung perkantoran, mall, hotel	2026-03-09 19:45:28.511601	2026-03-09 19:45:28.511601
5e8f8001-9a61-4006-84a8-e28a9b1bc128	Architectural	architectural	Landmark	/uploads/category/0f8be880-8893-473d-b8ae-7e05fd49bcde.webp	Proyek arsitektur prestisius	2026-03-09 19:45:55.103751	2026-03-09 19:45:55.103751
\.

COPY public."category-product" (category_product_id, category_product_name, category_product_slug, created_at, updated_at) FROM stdin;
fc96337c-ad81-4967-a56c-8136763ab4b9	Standar	standar	2026-03-09 19:25:20.30421	2026-03-09 19:25:20.30421
94bea8ab-2e91-4632-8877-c98c7f5fcc84	Dekoratif	dekoratif	2026-03-09 19:25:28.01097	2026-03-09 19:25:28.01097
273da02c-5c9b-4bac-9076-f39a631e3f14	High Performance	high-performance	2026-03-09 19:25:40.879701	2026-03-09 19:25:40.879701
ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788	Safety	safety	2026-03-09 19:25:45.195934	2026-03-09 19:25:45.195934
\.

COPY public.category_blog_translations (id, category_blog_id, locale, category_blog_name) FROM stdin;
4863d8d2-119f-4c10-b4a2-bd82e95dd98e	a313dacf-c369-4b91-8529-a3403e2dad1b	en	Manufacturing
e18da684-3dc2-455f-be66-4c81281cb4fe	a313dacf-c369-4b91-8529-a3403e2dad1b	zh	制造业
3f865789-2881-4e51-ae89-dff36fe8c815	7cdd6dfc-e340-4f4a-bd38-fbe59d261a3f	en	Guide
30a94afe-e3d7-423b-90cd-88dd6b70d1e2	7cdd6dfc-e340-4f4a-bd38-fbe59d261a3f	zh	指南
\.

COPY public.category_portofolio_translations (id, category_portofolio_id, locale, category_portofolio_name, category_portofolio_description) FROM stdin;
5106d79a-8b75-4be9-9fea-5bdd7bd6a32d	f0f9a822-ce23-45ba-8360-71f2b3c7a4a7	en	Residential	Houses, apartments, villas
bd69fa2e-2808-4c9b-aa65-bac03a603b9b	f0f9a822-ce23-45ba-8360-71f2b3c7a4a7	zh	住宅	房屋、公寓、别墅
08189cbf-ce6f-4a4d-bb71-7f3dcba83e60	7ecb9b48-3adf-4d55-ac3c-063102a78995	en	Commercial	Office buildings, malls, hotels
93033d12-bfc7-4842-9564-4939332d612a	7ecb9b48-3adf-4d55-ac3c-063102a78995	zh	商业	写字楼、商场、酒店
3ccad157-9536-4b1e-a8a3-b41955198423	5e8f8001-9a61-4006-84a8-e28a9b1bc128	en	Architectural	Prestigious architectural projects
0b11a394-7576-46f7-a407-c5a0953d7d17	5e8f8001-9a61-4006-84a8-e28a9b1bc128	zh	建筑	享有盛誉的建筑项目
\.

COPY public.category_product_translations (id, category_product_id, locale, category_product_name) FROM stdin;
dea3118c-9a60-466f-b748-18e1cea897a3	fc96337c-ad81-4967-a56c-8136763ab4b9	en	Standard
ded4739e-538c-4fab-8476-c7bc42dea9af	fc96337c-ad81-4967-a56c-8136763ab4b9	zh	标准
f866f518-5b68-4544-ab5c-5a8e0ea5cacb	94bea8ab-2e91-4632-8877-c98c7f5fcc84	en	Decorative
a679fe5f-2096-46e2-8e47-93d92869e33d	94bea8ab-2e91-4632-8877-c98c7f5fcc84	zh	装饰性
9469d124-33be-46e0-9ec2-623e3d14c512	273da02c-5c9b-4bac-9076-f39a631e3f14	en	High Performance
3b086535-5085-45f2-a7d5-393d9c7e4fd0	273da02c-5c9b-4bac-9076-f39a631e3f14	zh	高性能
9e6bfc7d-65e0-4faf-a9cb-a4c052e4b6aa	ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788	en	Safety
b946fe06-8985-4409-b3ce-d1e89b1448e4	ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788	zh	安全
\.

COPY public.certification (certification_id, name, image, display_order, is_published, created_at, updated_at) FROM stdin;
c933f28e-6747-4f0f-b84a-f3484b7adae4	ISO 9001	/uploads/certification/bdc02b89-7a90-4b20-8c48-fb14d5166734.webp	1	t	2026-03-10 20:41:57.176543	2026-03-10 20:41:57.176543
f4a75103-9215-45ad-9fdf-1bda0c507749	SNI Product	/uploads/certification/6905d8a9-a7c6-45a2-a6e7-4d9002040131.webp	2	t	2026-03-10 20:42:25.275512	2026-03-10 20:42:25.275512
d1e9dd5f-4467-4751-8034-240662fd0c42	Service No 1	/uploads/certification/4d891526-63e2-4f42-991e-97bcdb8c225c.webp	3	t	2026-03-10 20:49:17.902764	2026-03-10 20:49:17.902764
\.

COPY public.certification_translations (id, certification_id, locale, name) FROM stdin;
\.

COPY public.company_stat (company_stat_id, value, label, display_order, is_published, created_at, updated_at) FROM stdin;
7ab15c5a-263b-4d3d-bb49-7ad509319d8b	15+	Tahun Pengalaman	1	t	2026-03-09 21:57:33.782984	2026-03-09 21:57:33.782984
b178cc2c-71c9-4cf7-a396-b6eb4e41905e	500+	Proyek Selesai	2	t	2026-03-09 22:27:16.470952	2026-03-09 22:27:16.470952
c5832f86-4a05-4388-a010-bf9f772f99f0	100+	Klien Puas	3	t	2026-03-09 22:27:46.464072	2026-03-09 22:27:46.464072
97248f70-2771-4bb1-be60-4bb93a8c56f0	99%	Tingkat Kepuasan	4	t	2026-03-09 22:29:16.706907	2026-03-09 22:29:16.706907
\.

COPY public.company_stat_translations (id, company_stat_id, locale, label) FROM stdin;
65ab1d40-443c-4b4e-8bb0-ecb6197be8b7	7ab15c5a-263b-4d3d-bb49-7ad509319d8b	en	Years of Experience
9a2e76f6-35a4-44ee-8262-90c562a78a41	7ab15c5a-263b-4d3d-bb49-7ad509319d8b	zh	经验年限
ee41eed9-14c9-4d19-8c04-ba404e7c375b	b178cc2c-71c9-4cf7-a396-b6eb4e41905e	en	Projects Completed
967dbf07-8b4d-4f56-a113-f4dfb306a123	b178cc2c-71c9-4cf7-a396-b6eb4e41905e	zh	已完成项目
a9ac608b-c822-4854-89cc-d2789fac5a77	c5832f86-4a05-4388-a010-bf9f772f99f0	en	Satisfied Clients
5f4fc227-b784-465c-aeae-dadba4b1efdc	c5832f86-4a05-4388-a010-bf9f772f99f0	zh	满意客户
\.

COPY public.contact (contact_id, contact_type, contact_label, contact_value, contact_value_extra, contact_icon, is_published, created_at, updated_at) FROM stdin;
336e9dd0-c120-4b11-a729-c488380aa524	phone	Telepon	0821 3705 6377	\N	Phone	t	2026-03-11 19:21:11.636731	2026-03-11 19:21:11.636731
9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c	email	Email	3s.glassindo@gmail.com	\N	Mail	t	2026-03-11 19:22:02.779861	2026-03-11 19:22:02.779861
8e5b84f5-4f00-4ae0-84ec-49830a67c2c2	address	Alamat	Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia	\N	MapPin	t	2026-03-11 19:23:33.695268	2026-03-11 19:23:33.695268
1647b47f-d470-4cfe-ae7b-8bf30ebff23d	operational_hours	Jam Operasional	Senin - Jumat: 08:00 - 17:00 WIB	Sabtu: 08:00 - 14:00 WIB	Clock	t	2026-03-11 19:25:25.401787	2026-03-11 12:25:42.125
\.

COPY public.contact_translations (id, contact_id, locale, contact_label, contact_value, contact_value_extra) FROM stdin;
c1c05c2f-4504-4dcf-94d4-1d62a5aaf854	9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c	en	Email	3s.glassindo@gmail.com	\N
b77db012-404d-404b-ae14-98e21636c3bf	9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c	zh	电子邮件	3s.glassindo@gmail.com	\N
\.

COPY public.content_cache (cache_key, cache_value, expires_at, created_at) FROM stdin;
content:about:company	{"rawHero":{"heroSectionId":"2ca262ce-4380-4455-a125-37dfcad2c1ed","pageKey":"about","preHeading":"ABOUT US","mainHeading":"Membangun Kepercayaan","subHeading":"Melalui Presisi dan Kualitas","description":"Manufaktur kaca tempered berpresisi tinggi dengan standar kualitas dan keandalan untuk setiap proyek.","backgroundImageUrl":"/uploads/hero/ce8f3cdc-871c-4747-ba49-e087ae6fe2bc.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":true},"rawBenefits":[{"benefitId":"5e4653f4-b8d3-47da-a41d-8126691f164a","benefitName":"Precision Manufacturing","benefitDescription":"Jasa pemrosesan tempered glass kami menggunakan teknologi CNC terbaru, menjamin akurasi tinggi pada pemotongan dan pelubangan untuk hasil kaca presisi.","benefitIcon":"Target"},{"benefitId":"7951de93-9e6f-4262-9fe4-caff482923ae","benefitName":"Quality Control","benefitDescription":"Kami menerapkan kontrol ketat dalam layanan tempering, dengan pengujian menyeluruh untuk memastikan kekerasan dan keamanan kaca memenuhi standar keselamatan.","benefitIcon":"ShieldCheck"},{"benefitId":"ca492795-ddb6-4609-a731-0f44acf63de8","benefitName":"Reliable Project Partner","benefitDescription":"Tim profesional kami siap membantu kebutuhan tempered glass Anda, dari konsultasi hingga pengiriman, memastikan material tersedia tepat waktu.","benefitIcon":"Users"},{"benefitId":"aaf63359-4ff0-453e-9418-729b45a5012b","benefitName":"Custom Glass Solution","benefitDescription":"Layanan tempered glass kami fleksibel, menyesuaikan kebutuhan unik Anda dengan ukuran custom dan ketebalan bervariasi, menghasilkan presisi tinggi.","benefitIcon":"Star"}],"rawStats":[{"companyStatId":"7ab15c5a-263b-4d3d-bb49-7ad509319d8b","value":"15+","label":"Tahun Pengalaman","displayOrder":1},{"companyStatId":"b178cc2c-71c9-4cf7-a396-b6eb4e41905e","value":"500+","label":"Proyek Selesai","displayOrder":2},{"companyStatId":"c5832f86-4a05-4388-a010-bf9f772f99f0","value":"100+","label":"Klien Puas","displayOrder":3},{"companyStatId":"97248f70-2771-4bb1-be60-4bb93a8c56f0","value":"99%","label":"Tingkat Kepuasan","displayOrder":4}],"rawContacts":[{"contactId":"336e9dd0-c120-4b11-a729-c488380aa524","contactType":"phone","contactLabel":"Telepon","contactValue":"0821 3705 6377","contactValueExtra":null,"contactIcon":"Phone"},{"contactId":"9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c","contactType":"email","contactLabel":"Email","contactValue":"3s.glassindo@gmail.com","contactValueExtra":null,"contactIcon":"Mail"},{"contactId":"8e5b84f5-4f00-4ae0-84ec-49830a67c2c2","contactType":"address","contactLabel":"Alamat","contactValue":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia","contactValueExtra":null,"contactIcon":"MapPin"},{"contactId":"1647b47f-d470-4cfe-ae7b-8bf30ebff23d","contactType":"operational_hours","contactLabel":"Jam Operasional","contactValue":"Senin - Jumat: 08:00 - 17:00 WIB","contactValueExtra":"Sabtu: 08:00 - 14:00 WIB","contactIcon":"Clock"}],"rawCategoryProducts":[{"categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar"},{"categoryProductId":"94bea8ab-2e91-4632-8877-c98c7f5fcc84","categoryProductName":"Dekoratif","categoryProductSlug":"dekoratif"},{"categoryProductId":"273da02c-5c9b-4bac-9076-f39a631e3f14","categoryProductName":"High Performance","categoryProductSlug":"high-performance"},{"categoryProductId":"ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788","categoryProductName":"Safety","categoryProductSlug":"safety"}],"rawSocialMedia":[{"socialMediaId":"200f91da-2804-419e-ab09-1406898a3158","platformName":"Facebook","profileUrl":"https://www.facebook.com/sinarsurya.saktiglassindo/","iconName":"Facebook"},{"socialMediaId":"c7a48b87-d784-4965-b35c-cd2d72aa3173","platformName":"Instagram","profileUrl":"https://www.instagram.com/saktitemp/","iconName":"Instagram"},{"socialMediaId":"9a167449-9ac2-4457-89f0-57eeaa921de8","platformName":"TikTok","profileUrl":"https://www.tiktok.com/@saktitemp","iconName":"Share2"}],"rawCertifications":[{"certificationId":"c933f28e-6747-4f0f-b84a-f3484b7adae4","name":"ISO 9001","image":"/uploads/certification/bdc02b89-7a90-4b20-8c48-fb14d5166734.webp","displayOrder":1},{"certificationId":"f4a75103-9215-45ad-9fdf-1bda0c507749","name":"SNI Product","image":"/uploads/certification/6905d8a9-a7c6-45a2-a6e7-4d9002040131.webp","displayOrder":2},{"certificationId":"d1e9dd5f-4467-4751-8034-240662fd0c42","name":"Service No 1","image":"/uploads/certification/4d891526-63e2-4f42-991e-97bcdb8c225c.webp","displayOrder":3}],"rawIndustries":[{"categoryPortofolioId":"f0f9a822-ce23-45ba-8360-71f2b3c7a4a7","categoryPortofolioName":"Residential","categoryPortofolioSlug":"residential","categoryPortofolioIcon":"Home","categoryPortofolioImage":"/uploads/category/af900f2a-b64e-4ce0-8e27-64f3b8df0c31.webp","categoryPortofolioDescription":"Rumah tinggal, apartemen, villa"},{"categoryPortofolioId":"7ecb9b48-3adf-4d55-ac3c-063102a78995","categoryPortofolioName":"Commercial","categoryPortofolioSlug":"commercial","categoryPortofolioIcon":"Building2","categoryPortofolioImage":"/uploads/category/25aeca1e-3559-407e-a3fb-7f4aa6f73a9a.webp","categoryPortofolioDescription":"Gedung perkantoran, mall, hotel"},{"categoryPortofolioId":"5e8f8001-9a61-4006-84a8-e28a9b1bc128","categoryPortofolioName":"Architectural","categoryPortofolioSlug":"architectural","categoryPortofolioIcon":"Landmark","categoryPortofolioImage":"/uploads/category/0f8be880-8893-473d-b8ae-7e05fd49bcde.webp","categoryPortofolioDescription":"Proyek arsitektur prestisius"}],"rawServices":[{"serviceId":"3c612a27-5604-4d42-97e4-16fca0dc37c6","serviceName":"Jasa Temper","serviceDescription":"Bawa kaca Anda, kami proses dengan standar industri tertinggi.","serviceIcon":"Wrench","serviceIsPublished":true,"servicePoints":["Proses potong presisi CNC","Slep & finishing profesional","Bor lubang untuk fitting","Coak sudut custom","Proses tempered bergaransi"],"serviceBtnText":"Konsultasi Jasa Temper","serviceBtnLink":"https://youtu.be/VnGfB8QIYaQ?si=u9Sll1Z3qvgSwBw_"},{"serviceId":"57a431cf-fbfe-4d32-9f98-1f93835c6c20","serviceName":"Order Kaca","serviceDescription":"Pesan kaca tempered siap pakai sesuai spesifikasi proyek Anda.","serviceIcon":"Ruler","serviceIsPublished":true,"servicePoints":["Pilihan jenis kaca lengkap","Custom ukuran & ketebalan","Finishing sesuai kebutuhan","Quality control ketat","Pengiriman aman & tepat waktu"],"serviceBtnText":"Konsultasi Order Kaca","serviceBtnLink":"https://youtu.be/VnGfB8QIYaQ?si=u9Sll1Z3qvgSwBw_"}]}	2026-04-01 11:35:41.133	2026-03-29 17:04:39.238838
content:calculator-rician:hero	{"heroSectionId":"4e996569-a21a-486a-92b1-5615ece97f4e","pageKey":"calculator-rician","preHeading":null,"mainHeading":"Rincian Penawaran","subHeading":"Berikut adalah estimasi biaya sementara berdasarkan spesifikasi yang anda pilih.","description":"Silakan hubungi whatsapp kami, untuk bernegosiasi dengan tim kami lebih lanjut.","backgroundImageUrl":"/uploads/hero/e3146d44-e147-488d-83e6-1d65f1a96c7f.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":false,"breadcrumbItems":[{"href":"/","label":"Home"},{"href":"/calculator","label":"Calculator"},{"href":"/calculator/rincian","label":"Rician Hasil"}]}	2026-04-01 13:42:40.79	2026-04-01 17:30:30.264141
content:portofolio:list	{"heroRow":{"heroSectionId":"5a6bb2c8-24d3-42e5-ac95-829907a2b35e","pageKey":"portofolio","preHeading":null,"mainHeading":"Intip Karya Kami:","subHeading":"Solusi Kaca untuk Segala Ruang","description":"Lebih dari 200 proyek kaca tempered premium telah kami selesaikan di seluruh Indonesia. Dari gedung pencakar langit hingga villa mewah setiap proyek adalah cerminan komitmen kami terhadap kualitas dan keamanan.","backgroundImageUrl":"/uploads/hero/63865b74-ee7c-485f-971d-695996291036.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":false,"breadcrumbItems":[{"href":"/","label":"Home"},{"href":"/portofolio","label":"Portofolio"}]},"statsRows":[{"companyStatId":"7ab15c5a-263b-4d3d-bb49-7ad509319d8b","value":"15+","label":"Tahun Pengalaman","displayOrder":1},{"companyStatId":"b178cc2c-71c9-4cf7-a396-b6eb4e41905e","value":"500+","label":"Proyek Selesai","displayOrder":2},{"companyStatId":"c5832f86-4a05-4388-a010-bf9f772f99f0","value":"100+","label":"Klien Puas","displayOrder":3},{"companyStatId":"97248f70-2771-4bb1-be60-4bb93a8c56f0","value":"99%","label":"Tingkat Kepuasan","displayOrder":4}],"categoryRows":[{"categoryPortofolioId":"f0f9a822-ce23-45ba-8360-71f2b3c7a4a7","categoryPortofolioName":"Residential","categoryPortofolioSlug":"residential","categoryPortofolioIcon":"Home","categoryPortofolioImage":"/uploads/category/af900f2a-b64e-4ce0-8e27-64f3b8df0c31.webp","categoryPortofolioDescription":"Rumah tinggal, apartemen, villa"},{"categoryPortofolioId":"7ecb9b48-3adf-4d55-ac3c-063102a78995","categoryPortofolioName":"Commercial","categoryPortofolioSlug":"commercial","categoryPortofolioIcon":"Building2","categoryPortofolioImage":"/uploads/category/25aeca1e-3559-407e-a3fb-7f4aa6f73a9a.webp","categoryPortofolioDescription":"Gedung perkantoran, mall, hotel"},{"categoryPortofolioId":"5e8f8001-9a61-4006-84a8-e28a9b1bc128","categoryPortofolioName":"Architectural","categoryPortofolioSlug":"architectural","categoryPortofolioIcon":"Landmark","categoryPortofolioImage":"/uploads/category/0f8be880-8893-473d-b8ae-7e05fd49bcde.webp","categoryPortofolioDescription":"Proyek arsitektur prestisius"}],"portofolioRows":[{"portofolioId":"5ec6c4fc-31f0-41c8-b663-1b9b86a4780c","portofolioName":"The Park Mall","portofolioSlug":"the-park-mall","portofolioShortDescription":"Penyediaan kaca tempered bervolume tinggi untuk area publik dan railing. Mengedepankan keamanan pengunjung dengan kaca tempered premium.","portofolioLocation":"Semarang","portofolioImageUrl":"/uploads/portofolio/b2ed9347-5a11-4a21-937e-ea2f039d3293.webp","portofolioIsPublishedAt":"2026-03-09T12:50:52.819Z","categoryPortofolioName":"Commercial","categoryPortofolioSlug":"commercial"}],"contactRows":[{"contactId":"336e9dd0-c120-4b11-a729-c488380aa524","contactType":"phone","contactLabel":"Telepon","contactValue":"0821 3705 6377","contactValueExtra":null,"contactIcon":"Phone"},{"contactId":"9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c","contactType":"email","contactLabel":"Email","contactValue":"3s.glassindo@gmail.com","contactValueExtra":null,"contactIcon":"Mail"},{"contactId":"8e5b84f5-4f00-4ae0-84ec-49830a67c2c2","contactType":"address","contactLabel":"Alamat","contactValue":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia","contactValueExtra":null,"contactIcon":"MapPin"},{"contactId":"1647b47f-d470-4cfe-ae7b-8bf30ebff23d","contactType":"operational_hours","contactLabel":"Jam Operasional","contactValue":"Senin - Jumat: 08:00 - 17:00 WIB","contactValueExtra":"Sabtu: 08:00 - 14:00 WIB","contactIcon":"Clock"}],"socialMediaRows":[{"socialMediaId":"200f91da-2804-419e-ab09-1406898a3158","platformName":"Facebook","profileUrl":"https://www.facebook.com/sinarsurya.saktiglassindo/","iconName":"Facebook"},{"socialMediaId":"c7a48b87-d784-4965-b35c-cd2d72aa3173","platformName":"Instagram","profileUrl":"https://www.instagram.com/saktitemp/","iconName":"Instagram"},{"socialMediaId":"9a167449-9ac2-4457-89f0-57eeaa921de8","platformName":"TikTok","profileUrl":"https://www.tiktok.com/@saktitemp","iconName":"Share2"}],"categoryProductRows":[{"categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar"},{"categoryProductId":"94bea8ab-2e91-4632-8877-c98c7f5fcc84","categoryProductName":"Dekoratif","categoryProductSlug":"dekoratif"},{"categoryProductId":"273da02c-5c9b-4bac-9076-f39a631e3f14","categoryProductName":"High Performance","categoryProductSlug":"high-performance"},{"categoryProductId":"ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788","categoryProductName":"Safety","categoryProductSlug":"safety"}]}	2026-04-01 14:08:30.404	2026-03-16 21:45:41.479417
content:article:list	{"heroRow":{"heroSectionId":"b84c7c08-764a-4f33-8d36-ad0484226a09","pageKey":"articles","preHeading":null,"mainHeading":"Blog dan Wawasan tentang Solusi Kaca","subHeading":"Kaca Tempered: Pilihan Tahan Lama dan Bergaya","description":"Artikel edukatif dan referensi profesional tentang kaca tempered untuk berbagai kebutuhan proyek.","backgroundImageUrl":"/uploads/hero/6285f1a5-d37b-480c-ba62-28f5976245c8.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":false,"breadcrumbItems":[{"href":"/","label":"Home"},{"href":"/article","label":"Blog & Artikel"}]},"blogRows":[{"blogId":"0148c61a-c973-4496-971e-8b3d54d6e313","blogTitle":"Keunggulan Kaca Tempered vs Kaca Biasa: Mana yang Lebih Baik?","blogSlug":"keunggulan-kaca-tempered-vs-kaca-biasa-mana-yang-lebih-baik","blogExcerpt":"Perbandingan lengkap antara kaca tempered dan kaca biasa dari segi keamanan, kekuatan, dan aplikasi.","blogImageUrl":"/uploads/blog/76aee852-6a63-4c0a-9606-eec25dcd5f19.webp","blogIsPublishedAt":"2026-03-09T12:31:19.409Z","categoryBlogId":"a313dacf-c369-4b91-8529-a3403e2dad1b","categoryBlogName":"Manufacturing"}],"categoryRows":[{"categoryBlogId":"a313dacf-c369-4b91-8529-a3403e2dad1b","categoryBlogName":"Manufacturing","categoryBlogSlug":"manufacturing"},{"categoryBlogId":"7cdd6dfc-e340-4f4a-bd38-fbe59d261a3f","categoryBlogName":"Guide","categoryBlogSlug":"guide"},{"categoryBlogId":"2bb0857a-c85d-48e3-baf4-f654fbcabb12","categoryBlogName":"Trends","categoryBlogSlug":"trends"}],"categoryProductRows":[{"categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar"},{"categoryProductId":"94bea8ab-2e91-4632-8877-c98c7f5fcc84","categoryProductName":"Dekoratif","categoryProductSlug":"dekoratif"},{"categoryProductId":"273da02c-5c9b-4bac-9076-f39a631e3f14","categoryProductName":"High Performance","categoryProductSlug":"high-performance"},{"categoryProductId":"ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788","categoryProductName":"Safety","categoryProductSlug":"safety"}],"contactRows":[{"contactId":"336e9dd0-c120-4b11-a729-c488380aa524","contactType":"phone","contactLabel":"Telepon","contactValue":"0821 3705 6377","contactValueExtra":null,"contactIcon":"Phone"},{"contactId":"9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c","contactType":"email","contactLabel":"Email","contactValue":"3s.glassindo@gmail.com","contactValueExtra":null,"contactIcon":"Mail"},{"contactId":"8e5b84f5-4f00-4ae0-84ec-49830a67c2c2","contactType":"address","contactLabel":"Alamat","contactValue":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia","contactValueExtra":null,"contactIcon":"MapPin"},{"contactId":"1647b47f-d470-4cfe-ae7b-8bf30ebff23d","contactType":"operational_hours","contactLabel":"Jam Operasional","contactValue":"Senin - Jumat: 08:00 - 17:00 WIB","contactValueExtra":"Sabtu: 08:00 - 14:00 WIB","contactIcon":"Clock"}],"socialMediaRows":[{"socialMediaId":"200f91da-2804-419e-ab09-1406898a3158","platformName":"Facebook","profileUrl":"https://www.facebook.com/sinarsurya.saktiglassindo/","iconName":"Facebook"},{"socialMediaId":"c7a48b87-d784-4965-b35c-cd2d72aa3173","platformName":"Instagram","profileUrl":"https://www.instagram.com/saktitemp/","iconName":"Instagram"},{"socialMediaId":"9a167449-9ac2-4457-89f0-57eeaa921de8","platformName":"TikTok","profileUrl":"https://www.tiktok.com/@saktitemp","iconName":"Share2"}]}	2026-04-01 14:09:23.599	2026-03-28 14:37:54.217557
content:about:contact	{"rawHero":{"heroSectionId":"7d5d14a8-edd7-40ca-84fa-6e0a8ef250e6","pageKey":"contact","preHeading":"CONTACT US","mainHeading":"Hubungi Kami","subHeading":"Untuk Pertanyaan dan Dukungan","description":"Kami menyediakan layanan manufaktur kaca tempered berkualitas tinggi. Jika Anda memiliki pertanyaan atau ingin mendiskusikan proyek Anda, jangan ragu untuk menghubungi kami!","backgroundImageUrl":"/uploads/hero/a14b9b5f-7231-4e4d-b0f9-5b86f046fb2b.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":true},"rawLocations":[{"locationId":"1c1cf355-2ca8-4d4a-860e-8154a879e96c","locationCity":"Semarang","locationType":"head","locationAddress":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Jawa Tengah, Semarang, Indonesia 50117","locationMapUrl":"https://maps.app.goo.gl/x8qpitpPuAFHor4U8","locationMapEmbedUrl":"https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d990.1273995054233!2d110.48529126964822!3d-6.949054668312386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnNTYuNiJTIDExMMKwMjknMDkuNCJF!5e0!3m2!1sid!2sid!4v1773064082011!5m2!1sid!2sid"},{"locationId":"32b9b2f4-0a4a-49d7-8995-3ed25da6a551","locationCity":"Jakarta","locationType":"branch","locationAddress":"Marquee - Alamanda Tower 28th Floor Suite D Jl. TB Simatupang Kav. 23-24 Cilandak, Jakarta Selatan, Jakarta 12430","locationMapUrl":"https://maps.app.goo.gl/4XhUVu43StYBAsRM7","locationMapEmbedUrl":"https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d991.447943446529!2d106.80353866964779!3d-6.2910759665772895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTcnMjcuOSJTIDEwNsKwNDgnMTUuMSJF!5e0!3m2!1sid!2sid!4v1773065873260!5m2!1sid!2sid"}],"rawContacts":[{"contactId":"336e9dd0-c120-4b11-a729-c488380aa524","contactType":"phone","contactLabel":"Telepon","contactValue":"0821 3705 6377","contactValueExtra":null,"contactIcon":"Phone"},{"contactId":"9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c","contactType":"email","contactLabel":"Email","contactValue":"3s.glassindo@gmail.com","contactValueExtra":null,"contactIcon":"Mail"},{"contactId":"8e5b84f5-4f00-4ae0-84ec-49830a67c2c2","contactType":"address","contactLabel":"Alamat","contactValue":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia","contactValueExtra":null,"contactIcon":"MapPin"},{"contactId":"1647b47f-d470-4cfe-ae7b-8bf30ebff23d","contactType":"operational_hours","contactLabel":"Jam Operasional","contactValue":"Senin - Jumat: 08:00 - 17:00 WIB","contactValueExtra":"Sabtu: 08:00 - 14:00 WIB","contactIcon":"Clock"}],"rawCategoryProducts":[{"categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar"},{"categoryProductId":"94bea8ab-2e91-4632-8877-c98c7f5fcc84","categoryProductName":"Dekoratif","categoryProductSlug":"dekoratif"},{"categoryProductId":"273da02c-5c9b-4bac-9076-f39a631e3f14","categoryProductName":"High Performance","categoryProductSlug":"high-performance"},{"categoryProductId":"ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788","categoryProductName":"Safety","categoryProductSlug":"safety"}],"rawSocialMedia":[{"socialMediaId":"200f91da-2804-419e-ab09-1406898a3158","platformName":"Facebook","profileUrl":"https://www.facebook.com/sinarsurya.saktiglassindo/","iconName":"Facebook"},{"socialMediaId":"c7a48b87-d784-4965-b35c-cd2d72aa3173","platformName":"Instagram","profileUrl":"https://www.instagram.com/saktitemp/","iconName":"Instagram"},{"socialMediaId":"9a167449-9ac2-4457-89f0-57eeaa921de8","platformName":"TikTok","profileUrl":"https://www.tiktok.com/@saktitemp","iconName":"Share2"}]}	2026-04-01 14:21:40.276	2026-03-29 17:04:39.474909
content:landing:home	{"rawSlides":[{"carouselId":"7de8d2fe-affd-4cb6-853c-0818649099bb","carouselHeading":"WE UNDERSTAND","carouselSubheading":"Your Vision","carouselDescription":"Solusi kaca tempered premium untuk proyek komersial & residensial dengan standar kualitas Eropa","carouselImageUrl":"/uploads/carousel/6430a305-e965-4fc8-b0ce-fc3a7eb2b478.webp","carouselOrder":1},{"carouselId":"b78c265e-a739-4e4b-90b8-d86d42ecaef1","carouselHeading":"PRECISION IN","carouselSubheading":"Every Detail","carouselDescription":"Manufaktur kaca tempered dengan teknologi terkini dan kontrol kualitas ketat","carouselImageUrl":"/uploads/carousel/26a56244-ae05-494c-814c-c97ded1954ca.webp","carouselOrder":2},{"carouselId":"56795d41-e1f7-4357-8b28-56e323765a4e","carouselHeading":"YOUR TRUSTED","carouselSubheading":"Partner","carouselDescription":"Manufaktur kaca tempered dengan teknologi terkini dan kontrol kualitas ketat","carouselImageUrl":"/uploads/carousel/17e0cd61-504e-4b00-bbd6-06bfbba5c89f.webp","carouselOrder":3}],"rawBenefits":[{"benefitId":"5e4653f4-b8d3-47da-a41d-8126691f164a","benefitName":"Precision Manufacturing","benefitDescription":"Jasa pemrosesan tempered glass kami menggunakan teknologi CNC terbaru, menjamin akurasi tinggi pada pemotongan dan pelubangan untuk hasil kaca presisi.","benefitIcon":"Target"},{"benefitId":"7951de93-9e6f-4262-9fe4-caff482923ae","benefitName":"Quality Control","benefitDescription":"Kami menerapkan kontrol ketat dalam layanan tempering, dengan pengujian menyeluruh untuk memastikan kekerasan dan keamanan kaca memenuhi standar keselamatan.","benefitIcon":"ShieldCheck"},{"benefitId":"ca492795-ddb6-4609-a731-0f44acf63de8","benefitName":"Reliable Project Partner","benefitDescription":"Tim profesional kami siap membantu kebutuhan tempered glass Anda, dari konsultasi hingga pengiriman, memastikan material tersedia tepat waktu.","benefitIcon":"Users"},{"benefitId":"aaf63359-4ff0-453e-9418-729b45a5012b","benefitName":"Custom Glass Solution","benefitDescription":"Layanan tempered glass kami fleksibel, menyesuaikan kebutuhan unik Anda dengan ukuran custom dan ketebalan bervariasi, menghasilkan presisi tinggi.","benefitIcon":"Star"}],"rawStats":[{"companyStatId":"7ab15c5a-263b-4d3d-bb49-7ad509319d8b","value":"15+","label":"Tahun Pengalaman","displayOrder":1},{"companyStatId":"b178cc2c-71c9-4cf7-a396-b6eb4e41905e","value":"500+","label":"Proyek Selesai","displayOrder":2},{"companyStatId":"c5832f86-4a05-4388-a010-bf9f772f99f0","value":"100+","label":"Klien Puas","displayOrder":3},{"companyStatId":"97248f70-2771-4bb1-be60-4bb93a8c56f0","value":"99%","label":"Tingkat Kepuasan","displayOrder":4}],"rawBlogs":[{"blogId":"0148c61a-c973-4496-971e-8b3d54d6e313","blogTitle":"Keunggulan Kaca Tempered vs Kaca Biasa: Mana yang Lebih Baik?","blogSlug":"keunggulan-kaca-tempered-vs-kaca-biasa-mana-yang-lebih-baik","blogExcerpt":"Perbandingan lengkap antara kaca tempered dan kaca biasa dari segi keamanan, kekuatan, dan aplikasi.","blogImageUrl":"/uploads/blog/76aee852-6a63-4c0a-9606-eec25dcd5f19.webp","blogIsPublishedAt":"2026-03-09T12:31:19.409Z","categoryName":"Manufacturing","categorySlug":"manufacturing"}],"rawPortofolios":[{"portofolioId":"5ec6c4fc-31f0-41c8-b663-1b9b86a4780c","portofolioName":"The Park Mall","portofolioSlug":"the-park-mall","portofolioShortDescription":"Penyediaan kaca tempered bervolume tinggi untuk area publik dan railing. Mengedepankan keamanan pengunjung dengan kaca tempered premium.","portofolioLocation":"Semarang","portofolioImageUrl":"/uploads/portofolio/b2ed9347-5a11-4a21-937e-ea2f039d3293.webp","portofolioIsPublishedAt":"2026-03-09T12:50:52.819Z","categoryName":"Commercial","categorySlug":"commercial"}],"rawLocations":[{"locationId":"1c1cf355-2ca8-4d4a-860e-8154a879e96c","locationCity":"Semarang","locationType":"head","locationAddress":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Jawa Tengah, Semarang, Indonesia 50117","locationMapUrl":"https://maps.app.goo.gl/x8qpitpPuAFHor4U8","locationMapEmbedUrl":"https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d990.1273995054233!2d110.48529126964822!3d-6.949054668312386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnNTYuNiJTIDExMMKwMjknMDkuNCJF!5e0!3m2!1sid!2sid!4v1773064082011!5m2!1sid!2sid"},{"locationId":"32b9b2f4-0a4a-49d7-8995-3ed25da6a551","locationCity":"Jakarta","locationType":"branch","locationAddress":"Marquee - Alamanda Tower 28th Floor Suite D Jl. TB Simatupang Kav. 23-24 Cilandak, Jakarta Selatan, Jakarta 12430","locationMapUrl":"https://maps.app.goo.gl/4XhUVu43StYBAsRM7","locationMapEmbedUrl":"https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d991.447943446529!2d106.80353866964779!3d-6.2910759665772895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTcnMjcuOSJTIDEwNsKwNDgnMTUuMSJF!5e0!3m2!1sid!2sid!4v1773065873260!5m2!1sid!2sid"}],"rawContacts":[{"contactId":"336e9dd0-c120-4b11-a729-c488380aa524","contactType":"phone","contactLabel":"Telepon","contactValue":"0821 3705 6377","contactValueExtra":null,"contactIcon":"Phone"},{"contactId":"9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c","contactType":"email","contactLabel":"Email","contactValue":"3s.glassindo@gmail.com","contactValueExtra":null,"contactIcon":"Mail"},{"contactId":"8e5b84f5-4f00-4ae0-84ec-49830a67c2c2","contactType":"address","contactLabel":"Alamat","contactValue":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia","contactValueExtra":null,"contactIcon":"MapPin"},{"contactId":"1647b47f-d470-4cfe-ae7b-8bf30ebff23d","contactType":"operational_hours","contactLabel":"Jam Operasional","contactValue":"Senin - Jumat: 08:00 - 17:00 WIB","contactValueExtra":"Sabtu: 08:00 - 14:00 WIB","contactIcon":"Clock"}],"rawCategoryProducts":[{"categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar"},{"categoryProductId":"94bea8ab-2e91-4632-8877-c98c7f5fcc84","categoryProductName":"Dekoratif","categoryProductSlug":"dekoratif"},{"categoryProductId":"273da02c-5c9b-4bac-9076-f39a631e3f14","categoryProductName":"High Performance","categoryProductSlug":"high-performance"},{"categoryProductId":"ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788","categoryProductName":"Safety","categoryProductSlug":"safety"}],"rawSocialMedia":[{"socialMediaId":"200f91da-2804-419e-ab09-1406898a3158","platformName":"Facebook","profileUrl":"https://www.facebook.com/sinarsurya.saktiglassindo/","iconName":"Facebook"},{"socialMediaId":"c7a48b87-d784-4965-b35c-cd2d72aa3173","platformName":"Instagram","profileUrl":"https://www.instagram.com/saktitemp/","iconName":"Instagram"},{"socialMediaId":"9a167449-9ac2-4457-89f0-57eeaa921de8","platformName":"TikTok","profileUrl":"https://www.tiktok.com/@saktitemp","iconName":"Share2"}]}	2026-04-02 12:15:03.594	2026-03-28 17:27:59.728613
content:product:list	{"heroRow":{"heroSectionId":"e972e5fd-5a17-4ae4-bf5a-b6c2015003d4","pageKey":"products","preHeading":null,"mainHeading":"Kaca Tempered Berkualitas","subHeading":"Untuk Setiap Kebutuhan Anda","description":"Jual kaca tempered berbagai jenis dan ketebalan untuk proyek residensial, komersial, dan arsitektural. Tersedia layanan jasa temper dan order kaca siap pakai.","backgroundImageUrl":"/uploads/hero/3d044f43-5520-48c0-aa35-81bcc6aaae6c.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":false,"breadcrumbItems":[{"href":"/","label":"Home"},{"href":"/products","label":"Products"}]},"productRows":[{"productId":"6af71bc6-20ea-498a-b609-2dcb5446d88e","productName":"Kaca Tempered Clear (Bening)","productSlug":"kaca-tempered-clear-bening","productShortDescription":"Kaca tempered bening dengan kejernihan tinggi, cocok untuk jendela, pintu kaca, dan partisi ruangan.","productImageUrl":"/uploads/product/7a676b7b-3173-424b-9dc5-28721f4cf45b.webp","categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar","productViews":28}],"categoryRows":[{"categoryProductId":"fc96337c-ad81-4967-a56c-8136763ab4b9","categoryProductName":"Standar","categoryProductSlug":"standar"},{"categoryProductId":"94bea8ab-2e91-4632-8877-c98c7f5fcc84","categoryProductName":"Dekoratif","categoryProductSlug":"dekoratif"},{"categoryProductId":"273da02c-5c9b-4bac-9076-f39a631e3f14","categoryProductName":"High Performance","categoryProductSlug":"high-performance"},{"categoryProductId":"ef4afa5c-88e2-4e1a-b30d-4d2cc8c04788","categoryProductName":"Safety","categoryProductSlug":"safety"}],"thicknessRows":[{"thicknessId":"aa5f96e1-83e4-4c89-8f51-c053d07a1e27","thicknessValue":5,"thicknessUnit":"mm"},{"thicknessId":"9b21fb57-f0f3-4d0a-8e53-2066e25b2742","thicknessValue":6,"thicknessUnit":"mm"},{"thicknessId":"1974132e-fda0-4fef-b18d-021a2ee68972","thicknessValue":6.38,"thicknessUnit":"mm"},{"thicknessId":"e0b83b8b-91be-4a70-a77a-0fd3590c4d8f","thicknessValue":8,"thicknessUnit":"mm"},{"thicknessId":"43bf8094-79f5-45e2-abb0-a53622b04275","thicknessValue":8.38,"thicknessUnit":"mm"},{"thicknessId":"233bdef2-7b19-4b77-a4f1-448f1fc234e6","thicknessValue":8.76,"thicknessUnit":"mm"},{"thicknessId":"16a8720b-4c81-4691-bd45-b2d7cdfd5ac5","thicknessValue":10,"thicknessUnit":"mm"},{"thicknessId":"84a76999-81d7-4fbf-9dc2-445899a60022","thicknessValue":10.38,"thicknessUnit":"mm"},{"thicknessId":"25f5db74-d87c-4434-b658-fc9a97ede437","thicknessValue":10.76,"thicknessUnit":"mm"},{"thicknessId":"753b9bb1-4e12-4e60-a090-d81d6d4020b1","thicknessValue":12,"thicknessUnit":"mm"},{"thicknessId":"8d3d43bf-4161-4786-bff9-b43cca77a6e9","thicknessValue":12.38,"thicknessUnit":"mm"},{"thicknessId":"41c39f6f-87d1-409c-8d8d-1ff439ed4a04","thicknessValue":12.76,"thicknessUnit":"mm"},{"thicknessId":"17afce8e-10ec-4bd2-903c-1172d6f29d07","thicknessValue":15,"thicknessUnit":"mm"},{"thicknessId":"f232e92a-2f4d-4268-88c4-ede28f2d4b95","thicknessValue":16.76,"thicknessUnit":"mm"},{"thicknessId":"822eed07-0567-475e-9da2-61a20304c38b","thicknessValue":17.52,"thicknessUnit":"mm"},{"thicknessId":"5a51525e-398e-4b74-9cc1-bdaec27686a3","thicknessValue":19,"thicknessUnit":"mm"},{"thicknessId":"e29fa76d-b3af-4d4e-adc0-4d5e026c15b9","thicknessValue":20.76,"thicknessUnit":"mm"},{"thicknessId":"e81a0938-898f-4e67-a1d5-52ff400aeef1","thicknessValue":21.52,"thicknessUnit":"mm"},{"thicknessId":"ddc010cf-f0a0-4668-a77a-a2591a84d5c1","thicknessValue":24.76,"thicknessUnit":"mm"},{"thicknessId":"b644e274-47b3-42f9-a67d-b82bf690eb26","thicknessValue":25.52,"thicknessUnit":"mm"}],"portofolioTypeRows":[{"portofolioTypeId":"70f87571-9c44-444f-b39c-4971c098d157","portofolioTypeName":"Gedung perkantoran","portofolioTypeSlug":"gedung-perkantoran"},{"portofolioTypeId":"eeee72bc-2867-4c42-8c16-310a15544806","portofolioTypeName":"Hotel & apartemen","portofolioTypeSlug":"hotel-apartemen"},{"portofolioTypeId":"1a1acb4c-56cd-4ad1-b9c6-1f0969d7c731","portofolioTypeName":"Pusat perbelanjaan","portofolioTypeSlug":"pusat-perbelanjaan"},{"portofolioTypeId":"898eacd2-dcae-4a9f-9bf0-514da593b5cf","portofolioTypeName":"Fasad komersial","portofolioTypeSlug":"fasad-komersial"}],"serviceRows":[{"serviceId":"3c612a27-5604-4d42-97e4-16fca0dc37c6","serviceName":"Jasa Temper","serviceDescription":"Bawa kaca Anda, kami proses dengan standar industri tertinggi.","serviceIcon":"Wrench","serviceIsPublished":true,"servicePoints":["Proses potong presisi CNC","Slep & finishing profesional","Bor lubang untuk fitting","Coak sudut custom","Proses tempered bergaransi"],"serviceBtnText":"Konsultasi Jasa Temper","serviceBtnLink":"https://youtu.be/VnGfB8QIYaQ?si=u9Sll1Z3qvgSwBw_"},{"serviceId":"57a431cf-fbfe-4d32-9f98-1f93835c6c20","serviceName":"Order Kaca","serviceDescription":"Pesan kaca tempered siap pakai sesuai spesifikasi proyek Anda.","serviceIcon":"Ruler","serviceIsPublished":true,"servicePoints":["Pilihan jenis kaca lengkap","Custom ukuran & ketebalan","Finishing sesuai kebutuhan","Quality control ketat","Pengiriman aman & tepat waktu"],"serviceBtnText":"Konsultasi Order Kaca","serviceBtnLink":"https://youtu.be/VnGfB8QIYaQ?si=u9Sll1Z3qvgSwBw_"}],"contactRows":[{"contactId":"336e9dd0-c120-4b11-a729-c488380aa524","contactType":"phone","contactLabel":"Telepon","contactValue":"0821 3705 6377","contactValueExtra":null,"contactIcon":"Phone"},{"contactId":"9a8daf5f-554a-4c22-b8d6-4ac7b1680b1c","contactType":"email","contactLabel":"Email","contactValue":"3s.glassindo@gmail.com","contactValueExtra":null,"contactIcon":"Mail"},{"contactId":"8e5b84f5-4f00-4ae0-84ec-49830a67c2c2","contactType":"address","contactLabel":"Alamat","contactValue":"Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Indonesia","contactValueExtra":null,"contactIcon":"MapPin"},{"contactId":"1647b47f-d470-4cfe-ae7b-8bf30ebff23d","contactType":"operational_hours","contactLabel":"Jam Operasional","contactValue":"Senin - Jumat: 08:00 - 17:00 WIB","contactValueExtra":"Sabtu: 08:00 - 14:00 WIB","contactIcon":"Clock"}],"socialMediaRows":[{"socialMediaId":"200f91da-2804-419e-ab09-1406898a3158","platformName":"Facebook","profileUrl":"https://www.facebook.com/sinarsurya.saktiglassindo/","iconName":"Facebook"},{"socialMediaId":"c7a48b87-d784-4965-b35c-cd2d72aa3173","platformName":"Instagram","profileUrl":"https://www.instagram.com/saktitemp/","iconName":"Instagram"},{"socialMediaId":"9a167449-9ac2-4457-89f0-57eeaa921de8","platformName":"TikTok","profileUrl":"https://www.tiktok.com/@saktitemp","iconName":"Share2"}],"thicknessByProduct":{"6af71bc6-20ea-498a-b609-2dcb5446d88e":[{"productThicknessValue":5,"productThicknessUnit":"mm"},{"productThicknessValue":6,"productThicknessUnit":"mm"},{"productThicknessValue":8,"productThicknessUnit":"mm"},{"productThicknessValue":10,"productThicknessUnit":"mm"},{"productThicknessValue":12,"productThicknessUnit":"mm"}]},"excellenceByProduct":{"6af71bc6-20ea-498a-b609-2dcb5446d88e":["Privasi one way mirror","Hemat energi 30%","Tampilan premium","UV protection 99%"]},"productPortofolioTypeIds":{"6af71bc6-20ea-498a-b609-2dcb5446d88e":["1a1acb4c-56cd-4ad1-b9c6-1f0969d7c731"]}}	2026-04-01 13:48:52.346	2026-04-01 18:05:21.229572
content:calculator:hero	{"heroSectionId":"fbdc675b-a3e1-4f7b-bf2e-72801f8b0aff","pageKey":"calculator","preHeading":null,"mainHeading":"HITUNG ESTIMASI BIAYA KACA PROYEK ANDA DALAM HITUNGAN DETIK","subHeading":"Dapatkan transparansi biaya untuk berbagai jenis kaca, ukuran custom, hingga layanan add-on SAKTITEMP.","description":"Rencanakan anggaran proyek Anda sekarang, dan tim kami siap memverifikasinya hingga penawaran final.","backgroundImageUrl":"/uploads/hero/4264ceee-1f96-45d9-8c5b-05d733c8d2f8.webp","scrollIndicatorText":"SCROLL","scrollIndicatorVisible":false,"breadcrumbItems":[{"href":"/","label":"Home"},{"href":"/calculator","label":"Calculator"}]}	2026-04-02 12:15:05.644	2026-03-28 17:33:16.066718
\.

COPY public.glass_prices (glass_prices_id, glass_type_id, thickness_id, variant, variant_image_url, variant_image_public_id, price_per_sqm, composition, composition_detail) FROM stdin;
f7e05c00-a2bd-450a-b42d-74e270ebf8e8	0c350645-d65a-4676-b6e3-62730705fd9a	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Clear	/uploads/product/31f04624-ffc1-4d70-b620-c0397f29172f.webp	31f04624-ffc1-4d70-b620-c0397f29172f.webp	210000.00	\N	\N
b7b48c57-8727-4b36-94dd-08544e33b03e	0c350645-d65a-4676-b6e3-62730705fd9a	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Dark Grey	/uploads/product/f6f5469f-9c9a-41bd-9e11-4e30a5db44ff.webp	f6f5469f-9c9a-41bd-9e11-4e30a5db44ff.webp	247000.00	\N	\N
bd44ef6b-26e7-4985-8199-610c453fd7cd	0c350645-d65a-4676-b6e3-62730705fd9a	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Reflective	/uploads/product/2760ed3e-c807-43e8-8dcb-00d6ee601fb6.webp	2760ed3e-c807-43e8-8dcb-00d6ee601fb6.webp	380000.00	\N	\N
8928bd77-df01-4d2b-9016-1c32da858e63	0c350645-d65a-4676-b6e3-62730705fd9a	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Warna	/uploads/product/a926e7df-4cc3-48be-aba9-0bc726eb5816.webp	a926e7df-4cc3-48be-aba9-0bc726eb5816.webp	310000.00	\N	\N
ece0ceba-b8bc-40cd-b55b-584a61a023be	0c350645-d65a-4676-b6e3-62730705fd9a	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Clear	/uploads/product/3e2d1729-15bc-4686-9133-5bf3d2b03cf0.webp	3e2d1729-15bc-4686-9133-5bf3d2b03cf0.webp	268000.00	\N	\N
a213787d-12b2-464c-970a-1632bac6af57	0c350645-d65a-4676-b6e3-62730705fd9a	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Dark Grey	/uploads/product/85db0dcd-e872-4b22-a644-ae1b8a3e4a24.webp	85db0dcd-e872-4b22-a644-ae1b8a3e4a24.webp	352000.00	\N	\N
88c0e2dc-bbac-4389-b215-ef1a7febc75b	0c350645-d65a-4676-b6e3-62730705fd9a	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Reflective	/uploads/product/badb72d6-d03a-44ac-b460-dfa290628e64.webp	badb72d6-d03a-44ac-b460-dfa290628e64.webp	556000.00	\N	\N
761f2fee-19d4-4dc0-a2c9-61ebc9972470	0c350645-d65a-4676-b6e3-62730705fd9a	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Warna	/uploads/product/418be244-34bf-4517-9de0-d0c9bf582d00.webp	418be244-34bf-4517-9de0-d0c9bf582d00.webp	352000.00	\N	\N
e927486e-7319-4d7c-9db5-7de561dba7d3	0c350645-d65a-4676-b6e3-62730705fd9a	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Clear	/uploads/product/c40d522c-7bad-405a-ad06-b4214ecafbec.webp	c40d522c-7bad-405a-ad06-b4214ecafbec.webp	394000.00	\N	\N
299a7778-81e2-44d6-beea-dc95893058d5	0c350645-d65a-4676-b6e3-62730705fd9a	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Dark Grey	/uploads/product/d603f856-109b-4971-83fd-1c826cf20aba.webp	d603f856-109b-4971-83fd-1c826cf20aba.webp	563000.00	\N	\N
705183a5-ba8a-4506-879f-84e81d700767	0c350645-d65a-4676-b6e3-62730705fd9a	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Reflective	/uploads/product/4797450e-7e62-48cd-9a44-876cb775e973.webp	4797450e-7e62-48cd-9a44-876cb775e973.webp	740000.00	\N	\N
d52c41b3-334a-4958-94de-fdaa887cb9ca	0c350645-d65a-4676-b6e3-62730705fd9a	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Warna	/uploads/product/e8477204-d41f-4f32-ad49-0f832acbf5d5.webp	e8477204-d41f-4f32-ad49-0f832acbf5d5.webp	588000.00	\N	\N
8e66c686-80f6-4fc7-b162-8c40178068ac	0c350645-d65a-4676-b6e3-62730705fd9a	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Clear	/uploads/product/cabebcf5-2d45-4d2d-b221-49d679c7d508.webp	cabebcf5-2d45-4d2d-b221-49d679c7d508.webp	488000.00	\N	\N
8f9ba0a2-8dc6-4478-accf-366b663c119b	0c350645-d65a-4676-b6e3-62730705fd9a	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Warna	/uploads/product/36b780d8-dc63-4945-8e25-2a1cff89750f.webp	36b780d8-dc63-4945-8e25-2a1cff89750f.webp	893000.00	\N	\N
7d3d502c-ccdc-4cbc-9fe8-a0910d29a956	0c350645-d65a-4676-b6e3-62730705fd9a	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Clear	/uploads/product/6c1f6c94-87d7-453f-be77-40973143317d.webp	6c1f6c94-87d7-453f-be77-40973143317d.webp	540000.00	\N	\N
dcd443f7-98fe-4501-9a77-266ceaf2584f	0c350645-d65a-4676-b6e3-62730705fd9a	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Warna	/uploads/product/7d396811-b3a1-4bab-b336-05ead4460d92.webp	7d396811-b3a1-4bab-b336-05ead4460d92.webp	1008000.00	\N	\N
276eac79-5ec3-4d2a-9850-b40178ee41cd	987df403-abd5-45bd-90dd-bbed75384b62	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Dark Grey	/uploads/product/c36a88a3-84c7-4349-b277-c8e3dad3fbf3.webp	c36a88a3-84c7-4349-b277-c8e3dad3fbf3.webp	95000.00	\N	\N
bdbe2733-faf5-45df-a014-7e32bc2f52c3	987df403-abd5-45bd-90dd-bbed75384b62	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Polos [Clear]	/uploads/product/d3412206-02e9-4ea7-96e5-9de9663c24d8.webp	d3412206-02e9-4ea7-96e5-9de9663c24d8.webp	79000.00	\N	\N
aaae48ec-be88-4582-8c27-72dcbd2ddd59	987df403-abd5-45bd-90dd-bbed75384b62	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Reflective [Stopsol]	/uploads/product/047ba42e-3650-4194-ad81-a91d33aedd4e.webp	047ba42e-3650-4194-ad81-a91d33aedd4e.webp	140000.00	\N	\N
d5048d8c-bb31-4abe-8914-f3bdeba4c153	987df403-abd5-45bd-90dd-bbed75384b62	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Warna [Tinted]	/uploads/product/8c3ae48b-794b-4450-b173-6afc99dd97d6.webp	8c3ae48b-794b-4450-b173-6afc99dd97d6.webp	95000.00	\N	\N
5a00684f-f7fe-487f-a5f4-85664cc20735	987df403-abd5-45bd-90dd-bbed75384b62	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Dark Grey	/uploads/product/d10a1bfc-619b-4e04-871c-4b8499760565.webp	d10a1bfc-619b-4e04-871c-4b8499760565.webp	95000.00	\N	\N
a21bd468-6ba8-4632-a8a0-757ad0f55905	987df403-abd5-45bd-90dd-bbed75384b62	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Polos [Clear]	/uploads/product/b1d3ac94-0152-4146-84e6-ba1b2cd7336c.webp	b1d3ac94-0152-4146-84e6-ba1b2cd7336c.webp	92000.00	\N	\N
80091c3a-5f74-43e0-80d1-f80d6bd22e31	987df403-abd5-45bd-90dd-bbed75384b62	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Reflective [Stopsol]	/uploads/product/b0c71441-1dd8-482e-bb5a-ff9fff623cd2.webp	b0c71441-1dd8-482e-bb5a-ff9fff623cd2.webp	190000.00	\N	\N
80939ba4-180d-403d-9c15-682a7d291ef7	987df403-abd5-45bd-90dd-bbed75384b62	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Warna [Tinted]	/uploads/product/4760d0c7-f3b1-45eb-b944-2228f88767d8.webp	4760d0c7-f3b1-45eb-b944-2228f88767d8.webp	110000.00	\N	\N
c042e3c0-af04-4b9f-b416-827a524a57d5	987df403-abd5-45bd-90dd-bbed75384b62	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Polos [Clear]	/uploads/product/cc21f0ce-3807-4c37-983d-94fee0ddebb5.webp	cc21f0ce-3807-4c37-983d-94fee0ddebb5.webp	143000.00	\N	\N
d9f19ddb-5265-460e-bf72-63cf23dd39ad	987df403-abd5-45bd-90dd-bbed75384b62	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Reflective [Stopsol]	/uploads/product/6aae64ad-4fdf-4cfa-8cac-50210f3146f2.webp	6aae64ad-4fdf-4cfa-8cac-50210f3146f2.webp	248000.00	\N	\N
c389a71f-511d-4e9b-8127-5de3b067c93d	987df403-abd5-45bd-90dd-bbed75384b62	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Warna [Tinted]	/uploads/product/f7fa1327-9747-4ac6-bd00-a3444fe7e34c.webp	f7fa1327-9747-4ac6-bd00-a3444fe7e34c.webp	143000.00	\N	\N
15473e86-6cb2-4123-9c7e-54121ecb4d77	987df403-abd5-45bd-90dd-bbed75384b62	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Polos [Clear]	/uploads/product/321b0403-80c1-49d5-aed7-f47a3984ef41.webp	321b0403-80c1-49d5-aed7-f47a3984ef41.webp	157000.00	\N	\N
a27ec20b-353b-4e16-a745-dc12cd2b4c8c	987df403-abd5-45bd-90dd-bbed75384b62	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Reflective [Stopsol]	/uploads/product/cc8bf062-e35d-45e3-b3a6-85fb764cc202.webp	cc8bf062-e35d-45e3-b3a6-85fb764cc202.webp	305000.00	\N	\N
a22cb05a-d534-4af9-996b-fc40dc7eedbc	987df403-abd5-45bd-90dd-bbed75384b62	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Warna [Tinted]	/uploads/product/b268b563-f0f6-4c0c-86e4-63f422f9b990.webp	b268b563-f0f6-4c0c-86e4-63f422f9b990.webp	175000.00	\N	\N
dcd00d9d-888c-428c-b7da-cca415b14b69	987df403-abd5-45bd-90dd-bbed75384b62	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Polos [Clear]	/uploads/product/16ece09d-e6f0-4320-b57d-9a81c073d52f.webp	16ece09d-e6f0-4320-b57d-9a81c073d52f.webp	187000.00	\N	\N
edb957da-59f2-43fd-bc3d-7a103865e9ac	987df403-abd5-45bd-90dd-bbed75384b62	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Reflective [Stopsol]	/uploads/product/26e71399-2e64-4d59-80bb-d074d0a7066c.webp	26e71399-2e64-4d59-80bb-d074d0a7066c.webp	340000.00	\N	\N
9b9ede08-1235-4667-9d95-682ca73c09da	987df403-abd5-45bd-90dd-bbed75384b62	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Warna [Tinted]	/uploads/product/f9728a26-9f2e-4f0d-850c-40e7aaa2b003.webp	f9728a26-9f2e-4f0d-850c-40e7aaa2b003.webp	205000.00	\N	\N
034ceeec-5c75-4c59-ae3a-5eeb8ea25700	987df403-abd5-45bd-90dd-bbed75384b62	17afce8e-10ec-4bd2-903c-1172d6f29d07	Polos [Clear]	/uploads/product/edc2c5c9-3917-470d-8191-347cf3e11a9f.webp	edc2c5c9-3917-470d-8191-347cf3e11a9f.webp	385000.00	\N	\N
a853a627-738c-4ef1-97a6-31337d9f9432	108f1702-0734-45a1-8245-21eb72efa0fd	1974132e-fda0-4fef-b18d-021a2ee68972	Kaca Laminated	/uploads/product/4c4a65af-06f2-43ab-974e-b53a486555c6.webp	4c4a65af-06f2-43ab-974e-b53a486555c6.webp	441000.00	Kaca Clear+PVB Clear+Kaca Clear	3mm + 0,38 + 3 mm
256f91a4-75d4-41f6-bb4e-ff281c6ac28b	108f1702-0734-45a1-8245-21eb72efa0fd	43bf8094-79f5-45e2-abb0-a53622b04275	Kaca Laminated	/uploads/product/a45e3b9f-ef99-42c2-ae81-1f5a26546ea7.webp	a45e3b9f-ef99-42c2-ae81-1f5a26546ea7.webp	493000.00	Kaca Clear+PVB Clear+Kaca Clear	4mm + 0,38 + 4 mm
3986053e-b221-4868-ad02-da7b73018905	108f1702-0734-45a1-8245-21eb72efa0fd	84a76999-81d7-4fbf-9dc2-445899a60022	Kaca Laminated	/uploads/product/88418f7a-3481-4d2c-9261-3bf26742372a.webp	88418f7a-3481-4d2c-9261-3bf26742372a.webp	557000.00	\N	\N
40844b5e-8e9b-4eff-9aed-106c2ef05050	108f1702-0734-45a1-8245-21eb72efa0fd	8d3d43bf-4161-4786-bff9-b43cca77a6e9	Kaca Laminated	/uploads/product/9764e33e-3949-4bfd-9893-c587880fd4ff.webp	9764e33e-3949-4bfd-9893-c587880fd4ff.webp	661000.00	\N	\N
63b64c09-0cdd-41f8-92d3-9e77c9c75eb8	87c93682-3265-4613-a6c5-d3bf1723ad60	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Clear	/uploads/product/b2d2eff2-0b94-48a1-8288-d4d55c18c826.webp	b2d2eff2-0b94-48a1-8288-d4d55c18c826.webp	163000.00	\N	\N
9b0b73d2-2902-4600-b8a3-ec93ac9cc6a0	87c93682-3265-4613-a6c5-d3bf1723ad60	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Dark Grey	/uploads/product/23cfd33b-ea17-4baa-8cea-cc8ace915ff0.webp	23cfd33b-ea17-4baa-8cea-cc8ace915ff0.webp	158000.00	\N	\N
ef228c58-4c45-409a-b201-2719c5cf266a	87c93682-3265-4613-a6c5-d3bf1723ad60	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	Warna	/uploads/product/d6c32fcb-809a-4ca3-8dce-376ea682880c.webp	d6c32fcb-809a-4ca3-8dce-376ea682880c.webp	247000.00	\N	\N
2fb9ff27-7182-4f2e-b551-f3b1766a576a	87c93682-3265-4613-a6c5-d3bf1723ad60	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Clear	/uploads/product/05949ccd-abac-463d-9684-0c25a73178e5.webp	05949ccd-abac-463d-9684-0c25a73178e5.webp	215000.00	\N	\N
5d736197-2766-49c1-a8a8-789508143137	87c93682-3265-4613-a6c5-d3bf1723ad60	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Dark Grey	/uploads/product/2a669713-5fec-470c-b254-fb38ed6a38ed.webp	2a669713-5fec-470c-b254-fb38ed6a38ed.webp	257000.00	\N	\N
dc2fe8a0-946a-4a7f-81f1-283ca2fdf728	87c93682-3265-4613-a6c5-d3bf1723ad60	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	Warna	/uploads/product/aa7872eb-dfe3-46e3-bb82-64eef4c351a8.webp	aa7872eb-dfe3-46e3-bb82-64eef4c351a8.webp	257000.00	\N	\N
545ca6c4-adbb-48dd-b221-d63449848a15	87c93682-3265-4613-a6c5-d3bf1723ad60	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Clear	/uploads/product/2cc2d7c8-575a-4a57-ba7f-3735d8e2ed6f.webp	2cc2d7c8-575a-4a57-ba7f-3735d8e2ed6f.webp	310000.00	\N	\N
0a46e535-4853-48e7-bab6-4236f38a4010	87c93682-3265-4613-a6c5-d3bf1723ad60	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Dark Grey	/uploads/product/f77d6b8f-2647-48d9-9e06-71569b301627.webp	f77d6b8f-2647-48d9-9e06-71569b301627.webp	368000.00	\N	\N
25162f89-cd1a-4187-aef1-5c95f62811c8	87c93682-3265-4613-a6c5-d3bf1723ad60	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	Warna	/uploads/product/72cd0869-e422-4de1-a4bd-e094e9155e69.webp	72cd0869-e422-4de1-a4bd-e094e9155e69.webp	415000.00	\N	\N
45626202-7906-4d0d-9712-4f2af5f628c5	87c93682-3265-4613-a6c5-d3bf1723ad60	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Clear	/uploads/product/51d56cad-b50f-468a-8532-8844d2169d69.webp	51d56cad-b50f-468a-8532-8844d2169d69.webp	415000.00	\N	\N
f95cb180-ddaa-41d9-8c74-2f8ec2a84281	87c93682-3265-4613-a6c5-d3bf1723ad60	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	Warna	/uploads/product/a5b42863-87db-40cf-867b-dbfe8d880fb2.webp	a5b42863-87db-40cf-867b-dbfe8d880fb2.webp	730000.00	\N	\N
708f68c5-1f43-4581-9b25-de89da18c846	87c93682-3265-4613-a6c5-d3bf1723ad60	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Clear	/uploads/product/2d4bf779-6b72-42b0-99c9-b3b5fe09c972.webp	2d4bf779-6b72-42b0-99c9-b3b5fe09c972.webp	478000.00	\N	\N
80e38107-7267-44c8-9beb-e1d05e588c98	87c93682-3265-4613-a6c5-d3bf1723ad60	753b9bb1-4e12-4e60-a090-d81d6d4020b1	Warna	/uploads/product/d3bcf868-2f01-4cd2-97d4-d07c62b86120.webp	d3bcf868-2f01-4cd2-97d4-d07c62b86120.webp	856000.00	\N	\N
f4ce777c-3b37-401b-9f85-a6169244ae31	987df403-abd5-45bd-90dd-bbed75384b62	5a51525e-398e-4b74-9cc1-bdaec27686a3	Polos [Clear]	/uploads/product/98a009d8-61fd-41da-8748-118b893eb8ee.webp	98a009d8-61fd-41da-8748-118b893eb8ee.webp	495000.00	\N	\N
3fbe4ec5-ce4e-4da7-8755-ef23eccea8a0	108f1702-0734-45a1-8245-21eb72efa0fd	f232e92a-2f4d-4268-88c4-ede28f2d4b95	Kaca Laminated	/uploads/product/0b135f8e-4434-4e2a-9eb7-7e97fb9f98f7.webp	0b135f8e-4434-4e2a-9eb7-7e97fb9f98f7.webp	1040000.00	\N	\N
7a4d1619-481c-4cf2-b3e6-c58b65cca197	108f1702-0734-45a1-8245-21eb72efa0fd	e29fa76d-b3af-4d4e-adc0-4d5e026c15b9	Kaca Laminated	/uploads/product/81009c18-8e4f-41c8-bb86-eaedfdaa0c63.webp	81009c18-8e4f-41c8-bb86-eaedfdaa0c63.webp	1297000.00	\N	\N
4599c5e8-4531-4271-b863-e269de03ec0c	108f1702-0734-45a1-8245-21eb72efa0fd	ddc010cf-f0a0-4668-a77a-a2591a84d5c1	Kaca Laminated	/uploads/product/1714f10f-a551-4dcd-96f1-c8f40f83ebc8.webp	1714f10f-a551-4dcd-96f1-c8f40f83ebc8.webp	1480000.00	\N	\N
7515f18d-9045-4589-bd31-7a0a998491b6	1b4a7900-48de-4028-b695-dc69f2537ee8	233bdef2-7b19-4b77-a4f1-448f1fc234e6	Kaca Laminated Tempered	/uploads/product/733d55e5-5d7a-48f4-ab1a-442fff0b53af.webp	733d55e5-5d7a-48f4-ab1a-442fff0b53af.webp	782000.00	Kaca Clear+ PVB Clear+Kaca Clear	\N
baf2831b-3e4e-4f10-a888-ddf8e5bff310	1b4a7900-48de-4028-b695-dc69f2537ee8	25f5db74-d87c-4434-b658-fc9a97ede437	Kaca Laminated Tempered	/uploads/product/513dd45b-f014-43b1-8f62-d0b3f1ff3ba9.webp	513dd45b-f014-43b1-8f62-d0b3f1ff3ba9.webp	861000.00	\N	\N
594fc975-dfa3-4217-8187-b14beed73fa8	1b4a7900-48de-4028-b695-dc69f2537ee8	41c39f6f-87d1-409c-8d8d-1ff439ed4a04	Kaca Laminated Tempered	/uploads/product/27729c19-0f58-4e6e-a94e-1ec19aac2286.webp	27729c19-0f58-4e6e-a94e-1ec19aac2286.webp	1087000.00	\N	\N
878c34dd-d87f-40e5-9e72-b6b6c06f2848	1b4a7900-48de-4028-b695-dc69f2537ee8	822eed07-0567-475e-9da2-61a20304c38b	Kaca Laminated Tempered	/uploads/product/ce901818-8e79-4cf5-a739-f9554a464f12.webp	ce901818-8e79-4cf5-a739-f9554a464f12.webp	1601000.00	\N	\N
e8211b4d-0322-4ff1-8b26-bda9b451e6ac	1b4a7900-48de-4028-b695-dc69f2537ee8	e81a0938-898f-4e67-a1d5-52ff400aeef1	Kaca Laminated Tempered	/uploads/product/6563d5af-21ef-4df7-a4ff-942a74ba25e6.webp	6563d5af-21ef-4df7-a4ff-942a74ba25e6.webp	1853000.00	\N	\N
b4444c37-949a-4e9a-b64e-acad8194547a	1b4a7900-48de-4028-b695-dc69f2537ee8	b644e274-47b3-42f9-a67d-b82bf690eb26	Kaca Laminated Tempered	/uploads/product/8da96382-1ee7-48ff-bd3b-6429a8ec0e29.webp	8da96382-1ee7-48ff-bd3b-6429a8ec0e29.webp	2037000.00	\N	\N
\.

COPY public.glass_prices_translations (id, glass_prices_id, locale, variant) FROM stdin;
46ba5ca3-f96c-4e8f-b843-1121a3af46bb	f7e05c00-a2bd-450a-b42d-74e270ebf8e8	id	Bening
4fdc29f8-ed61-41c4-a8c2-c00aa76caac8	f7e05c00-a2bd-450a-b42d-74e270ebf8e8	en	Clear
dc5e8918-f22c-4463-8640-f47974e4a23e	f7e05c00-a2bd-450a-b42d-74e270ebf8e8	zh	透明
f1bbc999-70ae-4d32-b057-488616b20e15	ece0ceba-b8bc-40cd-b55b-584a61a023be	id	Bening
81aee975-db8f-48bc-99b1-3547232f2767	ece0ceba-b8bc-40cd-b55b-584a61a023be	en	Clear
ec0a7be8-e8fc-4df2-8bb3-74258914e4fe	ece0ceba-b8bc-40cd-b55b-584a61a023be	zh	透明
051521c9-f596-4dd0-810f-5b3eba48e3d1	e927486e-7319-4d7c-9db5-7de561dba7d3	id	Bening
1afd2215-f945-41eb-b2e5-5738ead9b777	e927486e-7319-4d7c-9db5-7de561dba7d3	en	Clear
ff9308f7-f225-46bb-b94c-e66180739cff	e927486e-7319-4d7c-9db5-7de561dba7d3	zh	透明
ec985b3a-94f0-4200-ab89-60f9520c0746	8e66c686-80f6-4fc7-b162-8c40178068ac	id	Bening
b2e0d1f3-06fe-4187-851d-bc4860d72190	8e66c686-80f6-4fc7-b162-8c40178068ac	en	Clear
b7f33b9c-59ba-494d-9080-e626edbd1b31	8e66c686-80f6-4fc7-b162-8c40178068ac	zh	透明
d60c4abd-7ecd-4305-85be-d656f9f3f2e7	7d3d502c-ccdc-4cbc-9fe8-a0910d29a956	id	Bening
51f92b04-7276-4622-92ae-a3364b34c82f	7d3d502c-ccdc-4cbc-9fe8-a0910d29a956	en	Clear
845aa0d7-1942-4664-b264-eb2652dca005	7d3d502c-ccdc-4cbc-9fe8-a0910d29a956	zh	透明
c20aceee-3f72-49e8-8fb5-3ca3f8823c2c	8928bd77-df01-4d2b-9016-1c32da858e63	id	Warna
5e9717e4-da3c-4cb6-9420-6c57398393c2	8928bd77-df01-4d2b-9016-1c32da858e63	en	Color
5877664b-62bb-497a-be8b-95cdd86388f3	8928bd77-df01-4d2b-9016-1c32da858e63	zh	颜色
d7696a11-954c-49a7-a34d-441edb7e2550	761f2fee-19d4-4dc0-a2c9-61ebc9972470	id	Warna
86d78ba9-9dea-4967-8ac9-d535faa448e3	761f2fee-19d4-4dc0-a2c9-61ebc9972470	en	Color
dbf19329-4b4e-4482-a566-725eddcd3f7e	761f2fee-19d4-4dc0-a2c9-61ebc9972470	zh	颜色
fbd193ef-8ec6-421f-9226-22a3b992c2e9	d52c41b3-334a-4958-94de-fdaa887cb9ca	id	Warna
64b04992-eed7-44b6-85d4-6f06ce43ffb7	d52c41b3-334a-4958-94de-fdaa887cb9ca	en	Color
48bcb54f-5845-4f37-927f-671c42b49c5d	d52c41b3-334a-4958-94de-fdaa887cb9ca	zh	颜色
fd7b7823-bf07-44ce-b09c-56aadefed24e	8f9ba0a2-8dc6-4478-accf-366b663c119b	id	Warna
a12b85e5-51ec-4987-a83d-1b162c115258	8f9ba0a2-8dc6-4478-accf-366b663c119b	en	Color
bfd13e4f-9201-4266-92c1-8e957470d736	8f9ba0a2-8dc6-4478-accf-366b663c119b	zh	颜色
36bcc2bb-b06e-43d5-902c-3ca06ce2f72a	dcd443f7-98fe-4501-9a77-266ceaf2584f	id	Warna
5e82a920-1422-4b27-9ad7-c7667269d046	dcd443f7-98fe-4501-9a77-266ceaf2584f	en	Color
278b5419-0c18-45ed-a7e4-fb23a751860a	dcd443f7-98fe-4501-9a77-266ceaf2584f	zh	颜色
\.

COPY public.glass_types (glass_type_id, glass_type_name, glass_type_image_url, glass_type_image_public_id, created_at, updated_at) FROM stdin;
0c350645-d65a-4676-b6e3-62730705fd9a	Kaca Flat Tempered	/uploads/category/b154cc09-e4b4-4f8e-97ef-9a02e605439b.webp	b154cc09-e4b4-4f8e-97ef-9a02e605439b.webp	2026-03-26 21:21:56.04661	2026-04-02 11:16:40.077
108f1702-0734-45a1-8245-21eb72efa0fd	Kaca Laminated	/uploads/category/0918e261-3c75-46e3-905d-e85d97c7555a.webp	0918e261-3c75-46e3-905d-e85d97c7555a.webp	2026-03-26 21:24:19.564239	2026-04-02 11:17:16.306
1b4a7900-48de-4028-b695-dc69f2537ee8	Kaca Laminated Tempered	/uploads/category/44309bc1-30f4-47bb-b4aa-fd2ea6a196a3.webp	44309bc1-30f4-47bb-b4aa-fd2ea6a196a3.webp	2026-03-26 21:24:35.295301	2026-04-02 11:17:24.889
87c93682-3265-4613-a6c5-d3bf1723ad60	Kaca Potongan	/uploads/category/145ce6e0-e8ad-4ef6-bb4d-8b1bf5dafaaf.webp	145ce6e0-e8ad-4ef6-bb4d-8b1bf5dafaaf.webp	2026-03-26 21:23:45.683205	2026-04-02 11:17:39.185
987df403-abd5-45bd-90dd-bbed75384b62	Titip Tempered	/uploads/category/53391a70-6409-455c-a406-98d6b759da92.webp	53391a70-6409-455c-a406-98d6b759da92.webp	2026-03-26 21:23:15.449627	2026-04-02 12:01:26.013
\.

COPY public.glass_types_translations (id, glass_type_id, locale, glass_type_name) FROM stdin;
\.

COPY public.hero_section (hero_section_id, page_key, pre_heading, main_heading, sub_heading, description, background_image_url, background_image_public_id, breadcrumb_items, scroll_indicator_text, scroll_indicator_visible, is_published, created_at, updated_at) FROM stdin;
2ca262ce-4380-4455-a125-37dfcad2c1ed	about	ABOUT US	Membangun Kepercayaan	Melalui Presisi dan Kualitas	Manufaktur kaca tempered berpresisi tinggi dengan standar kualitas dan keandalan untuk setiap proyek.	/uploads/hero/ce8f3cdc-871c-4747-ba49-e087ae6fe2bc.webp	ce8f3cdc-871c-4747-ba49-e087ae6fe2bc.webp	\N	SCROLL	t	t	2026-03-11 19:42:15.028818	2026-03-11 19:42:15.028818
7d5d14a8-edd7-40ca-84fa-6e0a8ef250e6	contact	CONTACT US	Hubungi Kami	Untuk Pertanyaan dan Dukungan	Kami menyediakan layanan manufaktur kaca tempered berkualitas tinggi. Jika Anda memiliki pertanyaan atau ingin mendiskusikan proyek Anda, jangan ragu untuk menghubungi kami!	/uploads/hero/a14b9b5f-7231-4e4d-b0f9-5b86f046fb2b.webp	a14b9b5f-7231-4e4d-b0f9-5b86f046fb2b.webp	\N	SCROLL	t	t	2026-03-11 19:43:11.394494	2026-03-11 19:43:11.394494
5a6bb2c8-24d3-42e5-ac95-829907a2b35e	portofolio	\N	Intip Karya Kami:	Solusi Kaca untuk Segala Ruang	Lebih dari 200 proyek kaca tempered premium telah kami selesaikan di seluruh Indonesia. Dari gedung pencakar langit hingga villa mewah setiap proyek adalah cerminan komitmen kami terhadap kualitas dan keamanan.	/uploads/hero/63865b74-ee7c-485f-971d-695996291036.webp	63865b74-ee7c-485f-971d-695996291036.webp	[{"href": "/", "label": "Home"}, {"href": "/portofolio", "label": "Portofolio"}]	SCROLL	f	t	2026-03-11 19:37:01.382176	2026-03-24 12:10:34.577
b84c7c08-764a-4f33-8d36-ad0484226a09	articles	\N	Blog dan Wawasan tentang Solusi Kaca	Kaca Tempered: Pilihan Tahan Lama dan Bergaya	Artikel edukatif dan referensi profesional tentang kaca tempered untuk berbagai kebutuhan proyek.	/uploads/hero/6285f1a5-d37b-480c-ba62-28f5976245c8.webp	6285f1a5-d37b-480c-ba62-28f5976245c8.webp	[{"href": "/", "label": "Home"}, {"href": "/article", "label": "Blog & Artikel"}]	SCROLL	f	t	2026-03-11 19:40:24.755296	2026-03-24 12:10:41.092
e972e5fd-5a17-4ae4-bf5a-b6c2015003d4	products	\N	Kaca Tempered Berkualitas	Untuk Setiap Kebutuhan Anda	Jual kaca tempered berbagai jenis dan ketebalan untuk proyek residensial, komersial, dan arsitektural. Tersedia layanan jasa temper dan order kaca siap pakai.	/uploads/hero/3d044f43-5520-48c0-aa35-81bcc6aaae6c.webp	3d044f43-5520-48c0-aa35-81bcc6aaae6c.webp	[{"href": "/", "label": "Home"}, {"href": "/products", "label": "Products"}]	SCROLL	f	t	2026-03-11 19:38:32.369335	2026-03-24 12:10:55.878
fbdc675b-a3e1-4f7b-bf2e-72801f8b0aff	calculator	\N	HITUNG ESTIMASI BIAYA KACA PROYEK ANDA DALAM HITUNGAN DETIK	Dapatkan transparansi biaya untuk berbagai jenis kaca, ukuran custom, hingga layanan add-on SAKTITEMP.	Rencanakan anggaran proyek Anda sekarang, dan tim kami siap memverifikasinya hingga penawaran final.	/uploads/hero/4264ceee-1f96-45d9-8c5b-05d733c8d2f8.webp	4264ceee-1f96-45d9-8c5b-05d733c8d2f8.webp	[{"href": "/", "label": "Home"}, {"href": "/calculator", "label": "Calculator"}]	SCROLL	f	t	2026-03-24 19:04:29.134921	2026-04-01 02:01:44.213
4e996569-a21a-486a-92b1-5615ece97f4e	calculator-rician	\N	Rincian Penawaran	Berikut adalah estimasi biaya sementara berdasarkan spesifikasi yang anda pilih.	Silakan hubungi whatsapp kami, untuk bernegosiasi dengan tim kami lebih lanjut.	/uploads/hero/e3146d44-e147-488d-83e6-1d65f1a96c7f.webp	e3146d44-e147-488d-83e6-1d65f1a96c7f.webp	[{"href": "/", "label": "Home"}, {"href": "/calculator", "label": "Calculator"}, {"href": "/calculator/rincian", "label": "Rician Hasil"}]	SCROLL	f	t	2026-04-01 17:29:21.446225	2026-04-01 13:36:01.439
\.

COPY public.hero_section_translations (id, hero_section_id, locale, pre_heading, main_heading, sub_heading, description, scroll_indicator_text, breadcrumb_items) FROM stdin;
44af2576-984e-4eb5-8c2c-e75827a35af1	2ca262ce-4380-4455-a125-37dfcad2c1ed	en	ABOUT US	Building Trust	Through Precision and Quality	High-precision tempered glass manufacturing with quality and reliability standards for every project.	SCROLL	\N
dbfca9d0-0a01-4e74-8c86-eb621a6eb0af	2ca262ce-4380-4455-a125-37dfcad2c1ed	zh	关于我们	铸就信任	凭借精准与品质	高精度钢化玻璃制造，为每个项目提供符合质量与可靠性标准的产品。	滚动	\N
e84b29cb-76e9-420c-953e-4a6d0f9cbc92	fbdc675b-a3e1-4f7b-bf2e-72801f8b0aff	id	\N	HITUNG ESTIMASI BIAYA KACA PROYEK ANDA DALAM HITUNGAN DETIK	Dapatkan transparansi biaya untuk berbagai jenis kaca, ukuran custom, hingga layanan add-on SAKTITEMP.	Rencanakan anggaran proyek Anda sekarang, dan tim kami siap memverifikasinya hingga penawaran final.	SCROLL	[{"href": "/", "label": "Beranda"}, {"href": "/calculator", "label": "Kalkulator"}]
e6f822ad-986c-4338-b2f0-12ef574168ba	fbdc675b-a3e1-4f7b-bf2e-72801f8b0aff	en	\N	CALCULATE YOUR PROJECT'S GLASS COST ESTIMATE IN SECONDS	Get cost transparency for various types of glass, custom sizes, and SAKTITEMP add-on services.	Plan your project budget now, and our team is ready to verify it through to the final quotation.	SCROLL	[{"href": "/", "label": "Home"}, {"href": "/calculator", "label": "Calculator"}]
2aabb548-f01e-474e-8903-ef111ca8df09	fbdc675b-a3e1-4f7b-bf2e-72801f8b0aff	zh	\N	秒速估算您的项目玻璃成本	获取各种玻璃类型、定制尺寸以及SAKTITEMP附加服务的费用透明度。	立即规划您的项目预算，我们的团队随时准备进行核实，直至提供最终报价。	滚动	[{"href": "/", "label": "首页"}, {"href": "/calculator", "label": "计算器"}]
7fe9e1b7-5082-44a0-b329-b72f18e8a671	4e996569-a21a-486a-92b1-5615ece97f4e	id	\N	Rincian Penawaran	Berikut adalah estimasi biaya sementara berdasarkan spesifikasi yang Anda pilih.	Silakan hubungi WhatsApp kami untuk bernegosiasi lebih lanjut dengan tim kami.	SCROLL	[{"href": "/", "label": "Beranda"}, {"href": "/calculator", "label": "Kalkulator"}, {"href": "/calculator/rincian", "label": "Rincian Hasil"}]
855ff891-e609-4f97-b816-17e851b79fb4	4e996569-a21a-486a-92b1-5615ece97f4e	en	\N	Quotation Details	Below is a preliminary cost estimate based on your selected specifications.	Please contact us via WhatsApp to further discuss and negotiate with our team.	SCROLL	[{"href": "/", "label": "Home"}, {"href": "/calculator", "label": "Calculator"}, {"href": "/calculator/rincian", "label": "Quotation Results"}]
9d8b9531-0d41-4903-9330-d07dc883e420	4e996569-a21a-486a-92b1-5615ece97f4e	zh	\N	报价详情	以下是根据您所选规格的初步成本估算。	请通过WhatsApp联系我们，以便与我们的团队进一步协商。	滚动	[{"href": "/", "label": "首页"}, {"href": "/calculator", "label": "计算器"}, {"href": "/calculator/rincian", "label": "报价结果"}]
\.

COPY public.location (location_id, location_city, location_type, location_address, location_map_url, location_map_embed_url, location_is_published, created_at, updated_at) FROM stdin;
1c1cf355-2ca8-4d4a-860e-8154a879e96c	Semarang	head	Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota Semarang, Jawa Tengah, Semarang, Indonesia 50117	https://maps.app.goo.gl/x8qpitpPuAFHor4U8	https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d990.1273995054233!2d110.48529126964822!3d-6.949054668312386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnNTYuNiJTIDExMMKwMjknMDkuNCJF!5e0!3m2!1sid!2sid!4v1773064082011!5m2!1sid!2sid	t	2026-03-09 20:11:55.095518	2026-03-09 13:48:37.004
32b9b2f4-0a4a-49d7-8995-3ed25da6a551	Jakarta	branch	Marquee - Alamanda Tower 28th Floor Suite D Jl. TB Simatupang Kav. 23-24 Cilandak, Jakarta Selatan, Jakarta 12430	https://maps.app.goo.gl/4XhUVu43StYBAsRM7	https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d991.447943446529!2d106.80353866964779!3d-6.2910759665772895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTcnMjcuOSJTIDEwNsKwNDgnMTUuMSJF!5e0!3m2!1sid!2sid!4v1773065873260!5m2!1sid!2sid	t	2026-03-09 21:18:23.712745	2026-03-09 21:18:23.712745
\.

COPY public.location_translations (id, location_id, locale, location_city, location_address) FROM stdin;
\.

COPY public.modification (modification_id, name, thickness_id, modification_image_url, modification_image_public_id, price_per_side) FROM stdin;
529ff16b-a9a4-46cb-becf-03a9875837bb	Clear Ke Warna Deco-Lami	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	/uploads/category/07a99f44-0150-4cfb-a14d-dd91b5568b77.webp	07a99f44-0150-4cfb-a14d-dd91b5568b77.webp	146000.00
94944d58-9d6c-4907-ba0f-be6d774990cb	Clear Ke Warna Deco-Lami	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	/uploads/category/07a99f44-0150-4cfb-a14d-dd91b5568b77.webp	07a99f44-0150-4cfb-a14d-dd91b5568b77.webp	182000.00
9657aad5-3f6e-443c-8217-327087da5435	Clear Ke Warna Deco-Lami	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	/uploads/category/07a99f44-0150-4cfb-a14d-dd91b5568b77.webp	07a99f44-0150-4cfb-a14d-dd91b5568b77.webp	263000.00
b576edc3-8b29-402d-a7ab-107b97c5148d	Clear Ke Warna Deco-Lami TF	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	/uploads/category/b187815a-8290-45b1-b494-380d5a7e4220.webp	b187815a-8290-45b1-b494-380d5a7e4220.webp	165000.00
f35631bd-e042-45fb-9a2b-61ee08db4066	Clear Ke Warna Deco-Lami TF	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	/uploads/category/b187815a-8290-45b1-b494-380d5a7e4220.webp	b187815a-8290-45b1-b494-380d5a7e4220.webp	209000.00
1400853c-7068-476d-8bae-98147190973b	Clear Ke Warna Deco-Lami TF	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	/uploads/category/b187815a-8290-45b1-b494-380d5a7e4220.webp	b187815a-8290-45b1-b494-380d5a7e4220.webp	323000.00
b4ae9125-f341-4ec7-95a7-b20e99f93a06	Clear Ke Stopsol/Murex/Muflex Deco-Lami	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	/uploads/category/ab7db293-ccd7-4616-bd06-c529df2eabd0.webp	ab7db293-ccd7-4616-bd06-c529df2eabd0.webp	254000.00
b70b8ec1-b1a4-4970-bfe3-1bc80439d14d	Clear Ke Stopsol/Murex/Muflex Deco-Lami	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	/uploads/category/ab7db293-ccd7-4616-bd06-c529df2eabd0.webp	ab7db293-ccd7-4616-bd06-c529df2eabd0.webp	358000.00
a7af0730-8fee-421c-83f4-fc0c585f4278	Clear Ke Stopsol/Murex/Muflex Deco-Lami	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	/uploads/category/ab7db293-ccd7-4616-bd06-c529df2eabd0.webp	ab7db293-ccd7-4616-bd06-c529df2eabd0.webp	467000.00
62da34a8-5f3e-4244-b86b-9517a371defd	Clear Ke Stopsol/Murex/Muflex Deco-Lami TF	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	/uploads/category/0cd81fb2-e8b9-44a2-a847-f9489bbf65fd.webp	0cd81fb2-e8b9-44a2-a847-f9489bbf65fd.webp	261000.00
ad7a9c79-83c7-4860-87e4-7d495e2aa268	Clear Ke Stopsol/Murex/Muflex Deco-Lami TF	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	/uploads/category/0cd81fb2-e8b9-44a2-a847-f9489bbf65fd.webp	0cd81fb2-e8b9-44a2-a847-f9489bbf65fd.webp	391000.00
02d91cae-514e-4f75-b410-49b8b7d971aa	Clear Ke Stopsol/Murex/Muflex Deco-Lami TF	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	/uploads/category/0cd81fb2-e8b9-44a2-a847-f9489bbf65fd.webp	0cd81fb2-e8b9-44a2-a847-f9489bbf65fd.webp	537000.00
\.

COPY public.modification_translations (id, modification_id, locale, name) FROM stdin;
\.

COPY public.portofolio (portofolio_id, category_portofolio_id, portofolio_type_id, portofolio_name, portofolio_slug, portofolio_short_description, portofolio_about, portofolio_client, portofolio_location, portofolio_year, portofolio_area_size, portofolio_area_size_unit, portofolio_image_url, portofolio_image_public_id, portofolio_views, portofolio_is_published, portofolio_is_published_at, created_at, updated_at) FROM stdin;
5ec6c4fc-31f0-41c8-b663-1b9b86a4780c	7ecb9b48-3adf-4d55-ac3c-063102a78995	1a1acb4c-56cd-4ad1-b9c6-1f0969d7c731	The Park Mall	the-park-mall	Penyediaan kaca tempered bervolume tinggi untuk area publik dan railing. Mengedepankan keamanan pengunjung dengan kaca tempered premium.	<p>The Park Mall merupakan salah satu proyek flagship kami di kota Semarang. Pusat perbelanjaan modern ini memerlukan solusi kaca tempered yang tidak hanya estetis tetapi juga memenuhi standar keamanan tertinggi untuk area dengan traffic pengunjung yang sangat padat. Kami menyediakan berbagai jenis kaca tempered mulai dari railing tangga, fasad toko, hingga partisi area food court dengan spesifikasi yang disesuaikan untuk setiap kebutuhan.</p>	PT. Park Mall Development	Semarang	2026	57000	m²	/uploads/portofolio/b2ed9347-5a11-4a21-937e-ea2f039d3293.webp	b2ed9347-5a11-4a21-937e-ea2f039d3293.webp	16	t	2026-03-09 12:50:52.819	2026-03-09 19:50:52.820531	2026-04-01 11:35:36.956
\.

COPY public.portofolio_translations (id, portofolio_id, locale, portofolio_name, portofolio_short_description, portofolio_about, portofolio_client, portofolio_location) FROM stdin;
\.

COPY public.portofolio_type (portofolio_type_id, portofolio_type_name, portofolio_type_slug, created_at, updated_at) FROM stdin;
70f87571-9c44-444f-b39c-4971c098d157	Gedung perkantoran	gedung-perkantoran	2026-03-09 19:46:31.149332	2026-03-09 19:46:31.149332
eeee72bc-2867-4c42-8c16-310a15544806	Hotel & apartemen	hotel-apartemen	2026-03-09 19:46:38.080856	2026-03-09 19:46:38.080856
1a1acb4c-56cd-4ad1-b9c6-1f0969d7c731	Pusat perbelanjaan	pusat-perbelanjaan	2026-03-09 19:46:44.527092	2026-03-09 19:46:44.527092
898eacd2-dcae-4a9f-9bf0-514da593b5cf	Fasad komersial	fasad-komersial	2026-03-09 19:46:50.283633	2026-03-09 19:46:50.283633
\.

COPY public.portofolio_type_translations (id, portofolio_type_id, locale, portofolio_type_name) FROM stdin;
\.

COPY public.processing_categories (processing_category_id, category_name, category_image_url, category_image_public_id) FROM stdin;
fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	Bevel & Verstek	/uploads/category/e5444860-2912-428e-ab92-65963c0083e7.webp	e5444860-2912-428e-ab92-65963c0083e7.webp
979f8004-d3c7-4a55-8c4d-d5befe68ecbf	Cowak	/uploads/category/2d8547f4-871e-4b99-a561-40a1c5bb722f.webp	2d8547f4-871e-4b99-a561-40a1c5bb722f.webp
1b0851cf-f7e3-4839-a0f7-a69d38e11130	Edging Irregular	/uploads/category/ab4486bd-dc74-4274-8464-9f08dc464632.webp	ab4486bd-dc74-4274-8464-9f08dc464632.webp
0a3b8fac-1f46-464a-959d-091a6127a822	Edging Regular	/uploads/category/85204cbd-e634-4b9e-bbdd-cf2a413af21e.webp	85204cbd-e634-4b9e-bbdd-cf2a413af21e.webp
8045fa96-0bf7-4026-b878-24b54adeb585	Hole	/uploads/category/57ffe188-f276-4132-9e5a-4537254460de.webp	57ffe188-f276-4132-9e5a-4537254460de.webp
e4ba7414-a169-4356-acb6-de0e73080229	Sanblast	/uploads/category/338ae824-ff3f-49ee-89a0-990b18be1149.webp	338ae824-ff3f-49ee-89a0-990b18be1149.webp
\.

COPY public.processing_categories_translations (id, processing_category_id, locale, category_name) FROM stdin;
e35b00f1-3395-4490-a14a-0f3bab710ddd	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	id	Bevel & Verstek
32ca43eb-2018-444b-9187-8a7a211a2020	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	en	Bevel & Miter
ba38095f-5d97-456d-a941-16c56b440b55	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	zh	斜边与斜切
d9d3478f-49b6-4293-aecf-57d901dd28ae	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	id	Cowak
a2f7ee42-2d89-4f1c-bb16-b077fc4b384c	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	en	Cut-outs
6b64127c-1ee5-4b55-9a14-33ae55cfdc43	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	zh	切口
9bedf2b8-ff46-4fdc-aca7-f6b9673a8638	1b0851cf-f7e3-4839-a0f7-a69d38e11130	id	Polesan Tepi Tidak Beraturan
8b6f94f6-b9c8-4e2e-8c25-646f63cdbe29	1b0851cf-f7e3-4839-a0f7-a69d38e11130	en	Irregular Edging
fcdd33f3-834d-465c-81bc-124b881bc586	1b0851cf-f7e3-4839-a0f7-a69d38e11130	zh	不规则磨边
12e4900e-da5f-426f-85e2-396a86df8282	0a3b8fac-1f46-464a-959d-091a6127a822	id	Poles Tepi Standar
33cfc296-7b1f-4855-9e3f-219feb14820c	0a3b8fac-1f46-464a-959d-091a6127a822	en	Regular Edging
499c1736-bfb8-4e2a-a4a1-f9158462e175	0a3b8fac-1f46-464a-959d-091a6127a822	zh	标准磨边
889ffd82-ae0b-45af-a554-a0ce451bcfc3	8045fa96-0bf7-4026-b878-24b54adeb585	id	Lubang
c0a33742-48e0-43b3-aad9-ace8753ad55d	8045fa96-0bf7-4026-b878-24b54adeb585	en	Hole
8753342b-c5a0-4cd5-8f99-6107a5803ebf	8045fa96-0bf7-4026-b878-24b54adeb585	zh	孔
e7d2b4d7-10d5-43f4-99d2-ff45c336db55	e4ba7414-a169-4356-acb6-de0e73080229	id	Sanblast
583acd4a-17f6-4515-9530-70267dfdcb63	e4ba7414-a169-4356-acb6-de0e73080229	en	Sandblast
341e36cc-ccde-436d-bc79-be87bf97bb25	e4ba7414-a169-4356-acb6-de0e73080229	zh	喷砂
\.

COPY public.processing_prices (processing_prices_id, category_id, min_thickness, max_thickness, service_name, unit, price, thickness) FROM stdin;
bd7121e6-7233-436c-8fe1-1dc4ce850013	0a3b8fac-1f46-464a-959d-091a6127a822	5.00	6.00	Flat Arris Ground	m1	9500.00	\N
202a8420-6b77-4806-b490-94948fd08b7d	0a3b8fac-1f46-464a-959d-091a6127a822	8.00	10.00	Flat Arris Ground	m1	18000.00	\N
13e98375-1fbf-461b-a41b-daa23bc961a2	0a3b8fac-1f46-464a-959d-091a6127a822	\N	\N	Flat Arris Ground	m1	20500.00	12.00
23d71bac-b13e-4960-8315-194c2e277f11	0a3b8fac-1f46-464a-959d-091a6127a822	15.00	19.00	Flat Arris Ground	m1	81000.00	\N
9a6b83b5-f978-47d2-9c38-8ab33836dba7	0a3b8fac-1f46-464a-959d-091a6127a822	5.00	6.00	Flat Arris Polish	m1	10500.00	\N
d59a4b5b-d51e-4d9f-b9a3-6977e21c5750	0a3b8fac-1f46-464a-959d-091a6127a822	8.00	10.00	Flat Arris Polish	m1	20000.00	\N
b7c282aa-126d-4024-b803-c1cc3650a2f0	0a3b8fac-1f46-464a-959d-091a6127a822	\N	\N	Flat Arris Polish	m1	23000.00	12.00
e261fa16-521d-42f1-b98f-a8dee08a2c20	0a3b8fac-1f46-464a-959d-091a6127a822	15.00	19.00	Flat Arris Polish	m1	88000.00	\N
3612a43f-2c8b-42fd-93a8-b9e5ccc509fb	0a3b8fac-1f46-464a-959d-091a6127a822	5.00	6.00	Round Ground	m1	13000.00	\N
ef5aef00-916f-4326-b775-ede180b49248	0a3b8fac-1f46-464a-959d-091a6127a822	8.00	10.00	Round Ground	m1	24000.00	\N
88a862d3-a403-4dc9-9da3-93988e812fc0	0a3b8fac-1f46-464a-959d-091a6127a822	\N	\N	Round Ground	m1	30500.00	12.00
39325d85-39b4-4f3c-9b01-cf3aaca0d988	0a3b8fac-1f46-464a-959d-091a6127a822	15.00	19.00	Round Ground	m1	87000.00	\N
5cb79220-5cf9-43e4-a35d-0c8aca0b1b5e	0a3b8fac-1f46-464a-959d-091a6127a822	5.00	6.00	Round Polish	m1	16500.00	\N
f0a909e6-689e-4866-863a-5e7df4792359	0a3b8fac-1f46-464a-959d-091a6127a822	8.00	10.00	Round Polish	m1	26500.00	\N
f50df459-ac1a-45f7-bb19-95924ee34097	0a3b8fac-1f46-464a-959d-091a6127a822	\N	\N	Round Polish	m1	33000.00	12.00
db3444bc-132d-40ae-ba65-599a61ee545f	0a3b8fac-1f46-464a-959d-091a6127a822	15.00	19.00	Round Polish	m1	95000.00	\N
24170704-00ba-45fe-90c9-32bd1d99b0ae	0a3b8fac-1f46-464a-959d-091a6127a822	5.00	6.00	Verstek Lurus 45	m1	33000.00	\N
3d2c9b98-1046-44b6-bddd-c0c81b8c10dc	0a3b8fac-1f46-464a-959d-091a6127a822	8.00	10.00	Verstek Lurus 45	m1	45000.00	\N
0bc0c664-ef78-4b8e-8a4c-3be8c5ad3eca	0a3b8fac-1f46-464a-959d-091a6127a822	\N	\N	Verstek Lurus 45	m1	52000.00	12.00
f6e460e9-260a-4e0d-a0a4-09c48dcb6a41	0a3b8fac-1f46-464a-959d-091a6127a822	15.00	19.00	Verstek Lurus 45	m1	146000.00	\N
39fd4c40-1e34-4e4f-8698-38eb59577678	1b0851cf-f7e3-4839-a0f7-a69d38e11130	5.00	6.00	Flat / Round Ground	m1	11500.00	\N
39e90866-415a-42b8-9e78-adc7b2adc2e6	1b0851cf-f7e3-4839-a0f7-a69d38e11130	8.00	10.00	Flat / Round Ground	m1	22500.00	\N
3b6d669e-d857-4b4f-8986-cd5127df8f3b	1b0851cf-f7e3-4839-a0f7-a69d38e11130	\N	\N	Flat / Round Ground	m1	26500.00	12.00
5416d7ca-4fe5-4ade-a4ed-d16fa67c4210	1b0851cf-f7e3-4839-a0f7-a69d38e11130	15.00	19.00	Flat / Round Ground	m1	88000.00	\N
dd22b5b4-f6e7-4e3f-a379-1cb3cf392b24	1b0851cf-f7e3-4839-a0f7-a69d38e11130	5.00	6.00	Flat / Round Polish	m1	13500.00	\N
92bfd15a-ba66-4055-b3b6-04d4f95663d2	1b0851cf-f7e3-4839-a0f7-a69d38e11130	8.00	10.00	Flat / Round Polish	m1	25000.00	\N
71b20401-6a45-44de-8d2f-b63ad36f0c78	1b0851cf-f7e3-4839-a0f7-a69d38e11130	\N	\N	Flat / Round Polish	m1	29500.00	12.00
204a852e-460e-4261-8eef-511d805c6a11	1b0851cf-f7e3-4839-a0f7-a69d38e11130	15.00	19.00	Flat / Round Polish	m1	95500.00	\N
12c000ca-5df3-478e-a55f-92d9cc34ce70	1b0851cf-f7e3-4839-a0f7-a69d38e11130	15.00	19.00	Corner / Sudut	m1	14000.00	\N
4fb20986-3416-40d0-a8fe-e2a7be9c050a	1b0851cf-f7e3-4839-a0f7-a69d38e11130	5.00	6.00	Corner / Sudut	m1	10000.00	\N
3023886d-f084-48ee-ad29-3b6c0439b231	1b0851cf-f7e3-4839-a0f7-a69d38e11130	5.00	6.00	Flat / Round Pencil Polish	m1	17500.00	\N
0aa138c1-f566-434a-816b-abec5c941f07	1b0851cf-f7e3-4839-a0f7-a69d38e11130	8.00	10.00	Corner / Sudut	m1	13000.00	\N
e0baada5-b7b5-4872-b16a-a2e00c4d918c	1b0851cf-f7e3-4839-a0f7-a69d38e11130	8.00	10.00	Flat / Round Pencil Polish	m1	28500.00	\N
49577dda-2ed3-4e44-9d95-32b9f67184ab	1b0851cf-f7e3-4839-a0f7-a69d38e11130	\N	\N	Corner / Sudut	m1	13000.00	12.00
7db95062-82ed-4b8f-a779-ff493b6a0942	1b0851cf-f7e3-4839-a0f7-a69d38e11130	\N	\N	Flat / Round Pencil Polish	m1	33000.00	12.00
f11c3d8b-d3c0-4daf-927b-9bcffb6acdc2	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	5.00	6.00	Bentuk Lurus / Kotak 10-30	m1	25500.00	\N
e4ecaf3b-fb46-4be2-b22a-192dd159586f	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	8.00	12.00	Bentuk Lurus / Kotak 10-30	m1	29000.00	\N
6e8a7e38-495b-4e2f-ac13-c1c8546d9d81	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	15.00	19.00	Bentuk Lurus / Kotak 10-30	m1	88500.00	\N
6bbb8f4b-1058-494c-9e50-12580812ceef	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	5.00	6.00	Bentuk Lurus / Kotak 35-40	m1	37000.00	\N
5b4e1b96-6ea0-42df-a15a-079a10c09222	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	8.00	12.00	Bentuk Lurus / Kotak 35-40	m1	54500.00	\N
fbfe42d1-20f1-4ce0-85d5-a13d4c4ac9ff	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	15.00	19.00	Bentuk Lurus / Kotak 35-40	m1	95500.00	\N
737a7be4-3771-4507-bf79-3d656e0411f3	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	8.00	12.00	Bentuk Lurus / Kotak 45-60	m1	79000.00	\N
fa54f131-1f4c-439b-ab09-c6ee9813f270	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	15.00	19.00	Bentuk Lurus / Kotak 45-60	m1	115500.00	\N
d0e3c7a4-7cd1-41a7-80ec-e887b95c6e34	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	5.00	6.00	Bentuk Oval / Irregular 10-30	m1	36000.00	\N
8d1ad1ae-0f46-4a57-af87-e719fa5bd06a	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	8.00	12.00	Bentuk Oval / Irregular 10-30	m1	58000.00	\N
64374fab-404a-4619-97c3-a74bcafb2a97	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	15.00	19.00	Bentuk Oval / Irregular 10-30	m1	105000.00	\N
a7dc2c04-a70d-4937-9052-7d126afbf424	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	5.00	6.00	Bentuk Oval / Irregular 35-40	m1	58000.00	\N
c6f971c9-018b-45ba-b60a-f9b488771a64	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	8.00	12.00	Bentuk Oval / Irregular 35-40	m1	88000.00	\N
3d6d5d15-b741-4fe1-a4b4-90cd105df9ad	fc45e3fa-7312-4a1a-9ce3-4a40cf4c402a	15.00	19.00	Bentuk Oval / Irregular 35-40	m1	153500.00	\N
f9983f5a-69ee-4c1c-95a7-a3c5ab588324	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	5.00	6.00	Cowak Kecil Pojok	pcs	33000.00	\N
eb0518b2-a252-47ef-910c-bc6cc6c7124e	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	8.00	12.00	Cowak Kecil Pojok	pcs	51000.00	\N
22c35653-ba4c-4c6d-9b60-afd99cf2372b	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	15.00	19.00	Cowak Kecil Pojok	pcs	146000.00	\N
071a8f26-eba1-439d-b492-e3a06b37be65	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	5.00	6.00	Cowak Besar Tepi	pcs	90500.00	\N
185f0a18-af87-4988-ad0b-75a37c6ddded	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	8.00	12.00	Cowak Besar Tepi	pcs	146000.00	\N
da9fa7e6-bc5b-40df-8d28-fae66a5644f3	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	15.00	19.00	Cowak Besar Tepi	pcs	256000.00	\N
a3a8bd4d-04c6-43f9-a843-eccab41668b1	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	5.00	6.00	Cowak Besar Pojok	pcs	47500.00	\N
90f4991e-74e5-4e73-91b4-084649961ad5	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	5.00	6.00	Cowak Kecil Tepi	pcs	66000.00	\N
7575bc77-0b67-4567-b65b-97f82f0a652c	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	8.00	12.00	Cowak Besar Pojok	pcs	90500.00	\N
0e7f507f-8794-4c92-9202-175cc42ff363	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	8.00	12.00	Cowak Kecil Tepi	pcs	90500.00	\N
0b8d8f09-0204-4040-8396-6f949a5aa21b	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	15.00	19.00	Cowak Besar Pojok	pcs	183000.00	\N
5e729758-81bc-441a-92bf-2d8a54acff52	979f8004-d3c7-4a55-8c4d-d5befe68ecbf	15.00	19.00	Cowak Kecil Tepi	pcs	215500.00	\N
7169110e-5bfd-4558-be6e-f0e09a8491db	8045fa96-0bf7-4026-b878-24b54adeb585	5.00	6.00	Diameter Bor <=30	pcs	10500.00	\N
d485ab4c-c116-4a74-b768-6747cfdbf4d1	8045fa96-0bf7-4026-b878-24b54adeb585	8.00	12.00	Diameter Bor <=30	pcs	20500.00	\N
9d2500e9-fa2c-4896-8a55-175b2ede0bdc	8045fa96-0bf7-4026-b878-24b54adeb585	15.00	19.00	Diameter Bor <=30	pcs	60000.00	\N
617626a8-c230-400f-9359-671d784c8426	8045fa96-0bf7-4026-b878-24b54adeb585	5.00	6.00	Diameter Bor 31-50	pcs	16500.00	\N
4074d1e6-5e8d-47d9-ad9a-7ea2831b1212	8045fa96-0bf7-4026-b878-24b54adeb585	8.00	12.00	Diameter Bor 31-50	pcs	29500.00	\N
de871f38-21aa-48ee-a9c5-ba9fe885800a	8045fa96-0bf7-4026-b878-24b54adeb585	15.00	19.00	Diameter Bor 31-50	pcs	78500.00	\N
788fe199-3c62-4fb4-980c-b8518eb5a981	8045fa96-0bf7-4026-b878-24b54adeb585	5.00	6.00	Diameter Bor > 50	pcs	102500.00	\N
9aab8bda-a4ca-49bf-bb19-bed50c20f213	8045fa96-0bf7-4026-b878-24b54adeb585	8.00	12.00	Diameter Bor > 50	pcs	132000.00	\N
37724191-334b-4250-8b38-7f291b503303	8045fa96-0bf7-4026-b878-24b54adeb585	15.00	19.00	Diameter Bor > 50	pcs	292000.00	\N
5e9dbaf2-239e-4903-8e2c-552c6b39af70	8045fa96-0bf7-4026-b878-24b54adeb585	5.00	6.00	Lubang Kotak	pcs	102500.00	\N
7a688629-7eab-429a-8e5f-6e0834477aa2	8045fa96-0bf7-4026-b878-24b54adeb585	8.00	12.00	Lubang Kotak	pcs	132000.00	\N
c5cf7050-01ce-4f67-a167-6a0e18a1d1e0	8045fa96-0bf7-4026-b878-24b54adeb585	15.00	19.00	Lubang Kotak	pcs	292000.00	\N
a1f3118e-d634-49a6-9647-c4a5ed3024fb	e4ba7414-a169-4356-acb6-de0e73080229	5.00	12.00	SB Full Block	none	160000.00	\N
cb1850f6-e9f1-417c-b395-e0da94c3fd9e	e4ba7414-a169-4356-acb6-de0e73080229	5.00	12.00	SB Motif	none	230000.00	\N
\.

COPY public.processing_prices_translations (id, processing_prices_id, locale, service_name) FROM stdin;
908feb25-c243-4548-871e-d6619876a3fd	bd7121e6-7233-436c-8fe1-1dc4ce850013	id	Pengasahan Pinggir Datar
677d1c9b-03ff-4f28-be71-3eedc02a6355	bd7121e6-7233-436c-8fe1-1dc4ce850013	en	Flat Arris Ground
a41de5be-9dcf-4690-85a1-6e0ea98f5a20	bd7121e6-7233-436c-8fe1-1dc4ce850013	zh	平磨边
f0e92456-b7c2-4bdc-86d5-1db7b2b573a6	202a8420-6b77-4806-b490-94948fd08b7d	id	Pengasahan Tepi Datar Arris
22fa92ab-a910-45aa-beb8-0525b356a3bd	202a8420-6b77-4806-b490-94948fd08b7d	en	Flat Arris Ground
ed23e268-9d15-4ed3-a97f-f268df03947d	202a8420-6b77-4806-b490-94948fd08b7d	zh	平边倒角研磨
8efaaf15-c670-452b-86ee-88544a663401	13e98375-1fbf-461b-a41b-daa23bc961a2	id	Gerinda Tepi Datar Arris
857b2ba4-469d-4d64-8993-78105fa83510	13e98375-1fbf-461b-a41b-daa23bc961a2	en	Flat Arris Ground
c3ee319e-f3a2-4fc6-b1d1-49f97309e303	13e98375-1fbf-461b-a41b-daa23bc961a2	zh	平磨直边
32ec89d4-d04d-4950-b894-84d5fb22a4a9	23d71bac-b13e-4960-8315-194c2e277f11	id	Pengasahan Tepi Datar Arris
aef92187-c09e-4a60-88cf-138a9c71b389	23d71bac-b13e-4960-8315-194c2e277f11	en	Flat Arris Ground
2e706862-dc21-4826-ae1d-a09ad17b1776	23d71bac-b13e-4960-8315-194c2e277f11	zh	平磨倒角
6168f3ec-a25f-4ef9-8b79-aa3d0cc0e8d1	9a6b83b5-f978-47d2-9c38-8ab33836dba7	id	Poles Arris Datar
7d507aae-b1dc-48b1-84bc-4a413e1286f2	9a6b83b5-f978-47d2-9c38-8ab33836dba7	en	Flat Arris Polish
951420c4-abeb-488f-a76d-04e7d3425bfb	9a6b83b5-f978-47d2-9c38-8ab33836dba7	zh	平板磨边抛光
802ca295-ef23-4a65-aa07-d22b38afa894	d59a4b5b-d51e-4d9f-b9a3-6977e21c5750	id	Polesan Arris Datar
0dead331-b88f-4171-a8b3-ce7d2a932222	d59a4b5b-d51e-4d9f-b9a3-6977e21c5750	en	Flat Arris Polish
8bd61831-7742-4355-afcf-d8854edb999a	d59a4b5b-d51e-4d9f-b9a3-6977e21c5750	zh	平边倒角抛光
2101234b-6170-4248-9f89-4ff1fe0a569a	e261fa16-521d-42f1-b98f-a8dee08a2c20	id	Poles Arris Datar
4f892a0f-e111-4aba-aad7-f16da69da512	e261fa16-521d-42f1-b98f-a8dee08a2c20	en	Flat Arris Polish
47b525f0-446f-4f9d-9da8-39f1d4b9adc7	e261fa16-521d-42f1-b98f-a8dee08a2c20	zh	平边倒角抛光
d203ada6-82e2-435d-8bed-cdfda6580e3d	b7c282aa-126d-4024-b803-c1cc3650a2f0	id	Poles Tepi Datar dan Arris
2d400625-82b6-4ef0-bd90-7f996a93475b	b7c282aa-126d-4024-b803-c1cc3650a2f0	en	Flat Arris Polish
b9888265-3534-4d27-82e2-8e463f9aeb7d	b7c282aa-126d-4024-b803-c1cc3650a2f0	zh	平边倒角抛光
8ee53fec-e937-45a8-a2f9-6c87f8711787	3612a43f-2c8b-42fd-93a8-b9e5ccc509fb	id	Gerinda Bulat
f552f441-5a08-4ea3-b66f-fe5123bdbd8a	3612a43f-2c8b-42fd-93a8-b9e5ccc509fb	en	Round Ground
63afcd05-5442-48ae-83a0-d574d2ae5eef	3612a43f-2c8b-42fd-93a8-b9e5ccc509fb	zh	圆边研磨
e6e41745-1f99-4269-84b0-f2d7b2384f89	ef5aef00-916f-4326-b775-ede180b49248	id	Gerinda Lingkar
b224553e-2bc4-4578-b905-43cf3d40e74d	ef5aef00-916f-4326-b775-ede180b49248	en	Round Ground
28bd6385-3f20-40b8-9030-7055a1f934fb	ef5aef00-916f-4326-b775-ede180b49248	zh	圆形磨边
5929af51-c431-46de-bc2e-1b9ac7936dc3	88a862d3-a403-4dc9-9da3-93988e812fc0	id	Gerinda Bundar
4f080b32-a49c-432e-b301-d89a706cbb0a	88a862d3-a403-4dc9-9da3-93988e812fc0	en	Round Ground
86a4ae85-0534-4d1d-979b-e1fea45f01d9	88a862d3-a403-4dc9-9da3-93988e812fc0	zh	磨圆边
05251c73-6811-43c7-b52b-788ecaf94b54	39325d85-39b4-4f3c-9b01-cf3aaca0d988	id	Gerinda Bulat
3a41a50b-a3a6-4154-a33d-0e9be9f229c1	39325d85-39b4-4f3c-9b01-cf3aaca0d988	en	Round Ground
5eca3ef9-cb5f-4ab2-83c1-c721811bbe5c	39325d85-39b4-4f3c-9b01-cf3aaca0d988	zh	圆边磨
36665b23-3e7b-4189-8908-4b6d6dca73ce	f0a909e6-689e-4866-863a-5e7df4792359	id	Poles Bundar
db7e8e05-ffa1-4ea3-91e2-a60197d2a290	f0a909e6-689e-4866-863a-5e7df4792359	en	Round Polish
94a88b4e-3c38-4f5c-8851-193d1aad483b	f0a909e6-689e-4866-863a-5e7df4792359	zh	圆边抛光
59616f8e-9cb1-4f55-9252-9acbd48e8a15	5cb79220-5cf9-43e4-a35d-0c8aca0b1b5e	id	Poles Bundar
690122b1-09a2-4eb7-b883-919b82987298	5cb79220-5cf9-43e4-a35d-0c8aca0b1b5e	en	Round Polish
83f78b7a-7e4d-4f74-9fff-071133e16e27	5cb79220-5cf9-43e4-a35d-0c8aca0b1b5e	zh	圆边抛光
a622622a-4961-467d-9ce1-fc2f7a1e994c	f50df459-ac1a-45f7-bb19-95924ee34097	id	Poles Bulat
1a58d327-6e67-406b-9539-b974fe10751d	f50df459-ac1a-45f7-bb19-95924ee34097	en	Round Polish
e46aaa22-e697-489d-92db-673378890174	f50df459-ac1a-45f7-bb19-95924ee34097	zh	圆边抛光
535d7011-7009-49c5-a783-4fd46ee60d79	db3444bc-132d-40ae-ba65-599a61ee545f	id	Poles Bulat
f7f40bf8-331a-4a5d-963b-22ba037bf55b	db3444bc-132d-40ae-ba65-599a61ee545f	en	Round Polish
69d763f5-70ea-4db7-b331-3c9cd401c7c4	db3444bc-132d-40ae-ba65-599a61ee545f	zh	圆形抛光
1542a49f-46cd-493a-b4bf-ddc4aa594859	24170704-00ba-45fe-90c9-32bd1d99b0ae	id	Verstek Lurus 45
f116fc80-c7fa-4ea7-a776-4b358c70edd2	24170704-00ba-45fe-90c9-32bd1d99b0ae	en	45 Degree Straight Bevel
cb84ec9f-fa4a-4292-a943-44c462750e2b	24170704-00ba-45fe-90c9-32bd1d99b0ae	zh	45度直斜边
dfc0576a-a50c-4d45-adc7-c222d32ab0d0	f6e460e9-260a-4e0d-a0a4-09c48dcb6a41	id	Verstek Lurus 45
5408a35d-b17a-4c71-9bda-59a5e37154bc	f6e460e9-260a-4e0d-a0a4-09c48dcb6a41	en	45-Degree Straight Miter
4f2ba6b6-6e4b-4950-b407-84923ec90763	f6e460e9-260a-4e0d-a0a4-09c48dcb6a41	zh	45度直斜切
\.

COPY public.product (product_id, category_product_id, product_name, product_slug, product_short_description, product_description, product_image_url, product_image_public_id, product_views, product_is_published, product_is_published_at, created_at, updated_at) FROM stdin;
6af71bc6-20ea-498a-b609-2dcb5446d88e	fc96337c-ad81-4967-a56c-8136763ab4b9	Kaca Tempered Clear (Bening)	kaca-tempered-clear-bening	Kaca tempered bening dengan kejernihan tinggi, cocok untuk jendela, pintu kaca, dan partisi ruangan.	<p>Kaca Tempered Reflektif tersedia dalam merek premium seperti Murex, Stopsol, dan T-Sunlux. Lapisan coating khusus memantulkan sinar matahari hingga 60%, menjaga suhu ruangan tetap sejuk. Tampilan mirror dari luar memberikan privasi total siang hari, sementara penghuni tetap dapat melihat keluar dengan jelas.</p>	/uploads/product/7a676b7b-3173-424b-9dc5-28721f4cf45b.webp	7a676b7b-3173-424b-9dc5-28721f4cf45b.webp	28	t	2026-03-09 12:38:36.534	2026-03-09 19:35:53.670172	2026-04-01 11:34:13.995
\.

COPY public."product-application" (product_application_id, product_id, product_application_image_url, product_application_image_public_id, product_application_name, product_application_description, product_application_slug, product_application_is_published, created_at, updated_at) FROM stdin;
ddf602e9-1b1c-4769-b6a1-18fc0c0bbab8	6af71bc6-20ea-498a-b609-2dcb5446d88e	/uploads/product/c45b9fc3-a2eb-4655-9b4e-5cf383772202.webp	c45b9fc3-a2eb-4655-9b4e-5cf383772202.webp	Glass Railing System	<p>Railing kaca tempered dengan handrail kayu solid untuk area koridor mall lantai 2. Kombinasi material yang elegan dengan standar keamanan tinggi.</p>	glass-railing-system	t	2026-03-09 19:41:54.32038	2026-03-09 19:41:54.32038
\.

COPY public."product-application-portofolio" (product_application_portofolio_id, product_application_id, portofolio_id, created_at, updated_at) FROM stdin;
b1d6e136-cf7e-4b39-bc03-0e728a4a1e2c	ddf602e9-1b1c-4769-b6a1-18fc0c0bbab8	5ec6c4fc-31f0-41c8-b663-1b9b86a4780c	2026-03-09 19:50:52.827963	2026-03-09 19:50:52.827963
\.

COPY public."product-exellence" (product_exellence_id, product_id, product_exellence_description, created_at, updated_at) FROM stdin;
0a0aeb4c-2dff-4a30-9a02-4c77c36d021b	6af71bc6-20ea-498a-b609-2dcb5446d88e	Privasi one way mirror	2026-03-09 19:38:36.540987	2026-03-09 19:38:36.540987
111e8c92-cf8d-42f7-9bbf-628c34e0d836	6af71bc6-20ea-498a-b609-2dcb5446d88e	Hemat energi 30%	2026-03-09 19:38:36.540987	2026-03-09 19:38:36.540987
44f19537-31a2-425e-bf50-dd0595a61722	6af71bc6-20ea-498a-b609-2dcb5446d88e	Tampilan premium	2026-03-09 19:38:36.540987	2026-03-09 19:38:36.540987
0b0f4f44-bdcb-4705-a6b1-0c490ea6d2b0	6af71bc6-20ea-498a-b609-2dcb5446d88e	UV protection 99%	2026-03-09 19:38:36.540987	2026-03-09 19:38:36.540987
\.

COPY public.product_application_translations (id, product_application_id, locale, product_application_name, product_application_description) FROM stdin;
\.

COPY public.product_exellence_translations (id, product_exellence_id, locale, product_exellence_description) FROM stdin;
\.

COPY public.product_thickness (product_id, thickness_id, created_at, updated_at) FROM stdin;
6af71bc6-20ea-498a-b609-2dcb5446d88e	aa5f96e1-83e4-4c89-8f51-c053d07a1e27	2026-03-09 19:38:36.53899	2026-03-09 19:38:36.53899
6af71bc6-20ea-498a-b609-2dcb5446d88e	9b21fb57-f0f3-4d0a-8e53-2066e25b2742	2026-03-09 19:38:36.53899	2026-03-09 19:38:36.53899
6af71bc6-20ea-498a-b609-2dcb5446d88e	e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	2026-03-09 19:38:36.53899	2026-03-09 19:38:36.53899
6af71bc6-20ea-498a-b609-2dcb5446d88e	16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	2026-03-09 19:38:36.53899	2026-03-09 19:38:36.53899
6af71bc6-20ea-498a-b609-2dcb5446d88e	753b9bb1-4e12-4e60-a090-d81d6d4020b1	2026-03-09 19:38:36.53899	2026-03-09 19:38:36.53899
\.

COPY public.product_translations (id, product_id, locale, product_name, product_short_description, product_description) FROM stdin;
\.

COPY public.rate_limit (id, key, count, last_request) FROM stdin;
\.

COPY public.service (service_id, service_name, service_description, service_icon, service_is_published, service_points, service_btn_text, service_btn_link, created_at, updated_at) FROM stdin;
3c612a27-5604-4d42-97e4-16fca0dc37c6	Jasa Temper	Bawa kaca Anda, kami proses dengan standar industri tertinggi.	Wrench	t	["Proses potong presisi CNC", "Slep & finishing profesional", "Bor lubang untuk fitting", "Coak sudut custom", "Proses tempered bergaransi"]	Konsultasi Jasa Temper	https://youtu.be/VnGfB8QIYaQ?si=u9Sll1Z3qvgSwBw_	2026-03-10 21:17:44.002636	2026-03-10 21:17:44.002636
57a431cf-fbfe-4d32-9f98-1f93835c6c20	Order Kaca	Pesan kaca tempered siap pakai sesuai spesifikasi proyek Anda.	Ruler	t	["Pilihan jenis kaca lengkap", "Custom ukuran & ketebalan", "Finishing sesuai kebutuhan", "Quality control ketat", "Pengiriman aman & tepat waktu"]	Konsultasi Order Kaca	https://youtu.be/VnGfB8QIYaQ?si=u9Sll1Z3qvgSwBw_	2026-03-10 21:55:56.119568	2026-03-11 11:58:29.503
\.

COPY public.service_translations (id, service_id, locale, service_name, service_description, service_points, service_btn_text) FROM stdin;
\.

COPY public.session (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) FROM stdin;
jYylQPzWybNFDwlaOfsAmm5FF6vlaoDd	2026-03-08 23:14:41.687	6BPMllj3zR7YGusgEQD5dT30m4cBBCK9	2026-03-08 14:10:26.732	2026-03-08 15:14:41.688	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
mOoneRgi1J4lt2qKNc6Ved3pu3LJnQXU	2026-03-09 22:57:01.742	ILmy3pz3oRMg2QTSXgP9XDNje1urKA2u	2026-03-09 11:37:26.403	2026-03-09 14:57:01.742	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
oKLs0FFASIuC4LFhj4C5kgIZHS0OTRl2	2026-03-10 22:55:56.093	8IahUhxVz4vqppCHGP0GjE7TnchPFkD5	2026-03-10 13:36:34.028	2026-03-10 14:55:56.093	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
mb6cYRyXt0SwcjChqG1Q6U4Dugtqg45R	2026-03-26 23:31:38.768	jLBbfer5KEoHVUUMpilu165uLqzxj4ud	2026-03-26 11:46:13.946	2026-03-26 15:31:38.768	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
8qonoHCQFbTR8WRhGydTeXjUuSucyIFF	2026-03-28 22:01:01.571	lTHgm1VzZBcEednRIhYSNSBNh7stoQUT	2026-03-28 14:01:01.572	2026-03-28 14:01:01.572	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
1Ztq50y8VWXQeYUyn6w5HYW6CwgWHLLO	2026-03-29 13:40:55.253	PNxyMIV5ACagtP7fcjbhypLdEBwgRPU9	2026-03-29 05:40:55.254	2026-03-29 05:40:55.254	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
Il24JVEUpOpfQT8w7SyPwGdbixxhQrgL	2026-03-29 19:49:13.586	KyHu8wjGiyd31VaYaSbhCrNKHte5WwIJ	2026-03-29 11:49:13.588	2026-03-29 11:49:13.588	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
cb1WWIYQtttipFjPvS1ilrZlUr8jZD8t	2026-03-30 21:10:37.527	tChfV2R9RLd7MRXquv97LBbkYtDB8QrG	2026-03-30 12:10:18.684	2026-03-30 13:10:37.527	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
4OZYPgWgwYDpKMDjbruC16O2sM9jVR0M	2026-04-01 21:30:03.483	5yBTsOblTPaPWGRQqw5IF6qgXhJ5AFHV	2026-04-01 13:30:03.486	2026-04-01 13:30:03.486	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	af922b38-7782-41aa-a65e-b781c12a38bb
\.

COPY public.social_media (social_media_id, platform_name, profile_url, icon_name, is_published, created_at, updated_at) FROM stdin;
200f91da-2804-419e-ab09-1406898a3158	Facebook	https://www.facebook.com/sinarsurya.saktiglassindo/	Facebook	t	2026-03-11 19:15:31.1119	2026-03-11 19:15:31.1119
c7a48b87-d784-4965-b35c-cd2d72aa3173	Instagram	https://www.instagram.com/saktitemp/	Instagram	t	2026-03-11 19:16:53.73821	2026-03-11 19:16:53.73821
9a167449-9ac2-4457-89f0-57eeaa921de8	TikTok	https://www.tiktok.com/@saktitemp	Share2	t	2026-03-11 19:19:14.672916	2026-03-11 19:19:14.672916
\.

COPY public.social_media_translations (id, social_media_id, locale, platform_name) FROM stdin;
\.

COPY public.thickness (thickness_id, thickness_value, thickness_unit, created_at, updated_at) FROM stdin;
aa5f96e1-83e4-4c89-8f51-c053d07a1e27	5	mm	2026-03-09 19:20:30.491742	2026-03-09 19:20:30.491742
9b21fb57-f0f3-4d0a-8e53-2066e25b2742	6	mm	2026-03-09 19:20:41.807773	2026-03-09 19:20:41.807773
e0b83b8b-91be-4a70-a77a-0fd3590c4d8f	8	mm	2026-03-09 19:20:48.91772	2026-03-09 19:20:48.91772
16a8720b-4c81-4691-bd45-b2d7cdfd5ac5	10	mm	2026-03-09 19:20:52.031785	2026-03-09 19:20:52.031785
753b9bb1-4e12-4e60-a090-d81d6d4020b1	12	mm	2026-03-09 19:20:59.85235	2026-03-09 19:20:59.85235
17afce8e-10ec-4bd2-903c-1172d6f29d07	15	mm	2026-03-29 19:04:53.132982	2026-03-29 19:04:53.132982
5a51525e-398e-4b74-9cc1-bdaec27686a3	19	mm	2026-03-29 19:04:56.658659	2026-03-29 19:04:56.658659
1974132e-fda0-4fef-b18d-021a2ee68972	6.38	mm	2026-03-29 19:17:21.010733	2026-03-29 19:17:21.010733
43bf8094-79f5-45e2-abb0-a53622b04275	8.38	mm	2026-03-29 19:17:29.974773	2026-03-29 19:17:29.974773
84a76999-81d7-4fbf-9dc2-445899a60022	10.38	mm	2026-03-29 19:17:36.489772	2026-03-29 19:17:36.489772
8d3d43bf-4161-4786-bff9-b43cca77a6e9	12.38	mm	2026-03-29 19:17:45.822172	2026-03-29 19:17:45.822172
f232e92a-2f4d-4268-88c4-ede28f2d4b95	16.76	mm	2026-03-29 19:17:55.135344	2026-03-29 12:18:30.812
e29fa76d-b3af-4d4e-adc0-4d5e026c15b9	20.76	mm	2026-03-29 19:18:40.575713	2026-03-29 19:18:40.575713
ddc010cf-f0a0-4668-a77a-a2591a84d5c1	24.76	mm	2026-03-29 19:18:47.185605	2026-03-29 19:18:47.185605
233bdef2-7b19-4b77-a4f1-448f1fc234e6	8.76	mm	2026-03-29 19:19:00.51698	2026-03-29 19:19:00.51698
25f5db74-d87c-4434-b658-fc9a97ede437	10.76	mm	2026-03-29 19:19:06.20053	2026-03-29 19:19:06.20053
41c39f6f-87d1-409c-8d8d-1ff439ed4a04	12.76	mm	2026-03-29 19:19:22.958204	2026-03-29 19:19:22.958204
822eed07-0567-475e-9da2-61a20304c38b	17.52	mm	2026-03-29 19:19:33.058595	2026-03-29 19:19:33.058595
e81a0938-898f-4e67-a1d5-52ff400aeef1	21.52	mm	2026-03-29 19:19:41.054192	2026-03-29 19:19:41.054192
b644e274-47b3-42f9-a67d-b82bf690eb26	25.52	mm	2026-03-29 19:19:51.771298	2026-03-29 12:20:05.543
\.

COPY public.thickness_translations (id, thickness_id, locale, thickness_unit) FROM stdin;
\.

COPY public."user" (id, name, email, email_verified, image, role, created_at, updated_at) FROM stdin;
af922b38-7782-41aa-a65e-b781c12a38bb	Admin SaktiTemp	admin@saktitemp.com	t	\N	admin	2026-03-08 21:07:03.029956	2026-03-08 21:07:03.029956
\.

COPY public.verification (id, identifier, value, expires_at, created_at, updated_at) FROM stdin;
\.

SET session_replication_role = DEFAULT;
COMMIT;
