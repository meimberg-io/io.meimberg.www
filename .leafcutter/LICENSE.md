# Leafcutter OS Licence

Version 1.2 \- Effective: October 8, 2026  
Copyright © 2026 Leafcutter UG (haftungsbeschränkt)

> **Changes in version 1.2 against version 1.1 (September 20, 2026).** The licence for a business
> organization is called the Business Licence, and it has no user quota: every employee and individual
> contractor working directly for the licensed legal entity is an Authorised User (section 2). The
> perpetual rights to the Versions obtained during a Subscription period hold only if the fee for that
> period was paid and not refunded or charged back (new section 5.5; sections 3.1, 4.1, 4.3, 5.2 and 5.3
> refer to it). Nothing else changed: the single licensed legal entity, the open artifact layer, the BYOL
> principle for client work, the exclusion of support and the AI clause are unchanged.

## 1\. What this licence is

1.1 **A licensed work, not a service.** Leafcutter OS is a licensed work: the software, documentation, and the methods, artifacts and training material **we** publish, which you obtain once and use yourself. What you author yourself with it is yours (section 2, "Your Artifacts"). It is not a software-as-a-service (SaaS) or hosted service. Purchasing a licence does not include hosting, continuous maintenance, operational services, consulting, or dedicated support.

1.2 **Acceptance.** By obtaining, downloading, installing, accessing, copying, or using Leafcutter OS, you agree to be bound by the terms of this licence. If you do not accept these terms, do not obtain, install, or use Leafcutter OS.

## 2\. Definitions

**"Licensor", "we", "us"**: Leafcutter UG (haftungsbeschränkt), registered in Berlin, Germany.  
**"Licensee", "you"**: the single business organization (single legal entity) or natural person acting in an independent professional or commercial capacity (as a freelancer or sole trader) named in the order confirmation as the buyer of a licence. Consumers within the meaning of § 13 German Civil Code (BGB) are strictly excluded from acquiring or using the Product.

- **Personal Licence:** you are a natural person acting as a sole trader or freelancer using Leafcutter OS solely for your own direct business operations.  
- **Business Licence:** you are a single business organization (one distinct legal entity) using Leafcutter OS solely for your internal business operations. A Business Licence covers solely the named legal entity and does not extend to parent companies, subsidiaries, affiliated entities, or group companies.  
- **Authorised Users:** a) For a Personal Licence: solely you as the named individual licensee. b) For a Business Licence: your direct employees and individual independent contractors performing work directly on your behalf, without a limit on their number. c) Automated tools, software agents, bots, and CI/CD pipelines operated by you for your internal business operations act on your behalf and are covered by your licence without being Authorised Users themselves.  
- **"Leafcutter OS"** or **"the Product"**: the software, artifacts, tooling, documentation and training materials **authored and published by us**, in any Version, format, or distribution channel. This comprises the core (leafcutter-os) with its engine, schemas, rules, validators, CLI and guide; the standard library collections we publish (leafcutter-library); our blueprints; and every artifact we publish (including without limitation agents, roles, skills, adapters, playbooks, methods, foundations and data pools). Repositories, specifications, or modules released under separate licence terms are not governed by this licence.  
- **"Your Artifacts"**: artifacts, blueprints, libraries, governance packs, document classes and rule sets **you author yourself** — whether for your own use or to publish to others — which do not incorporate substantial, identifiable parts of the Product's own artifacts, documentation or software. Declaring, extending, importing, depending on, or being validated, composed and delivered by the Product does **not** make a work part of the Product: an artifact that follows our types, rules and schemas, names our packages as dependencies, or runs on our engine and CLI remains Your Artifact. Your Artifacts are not the Product, are not Modifications, and are not governed by this licence except as stated in sections 3.5 and 6.2.  
- **"Version"**: a distinct release or snapshot of the Product, identified by a version number or release tag.  
- **"Subscription"**: a paid, time-limited entitlement (beginning with an initial 12-month period included upon purchase) providing access to new Versions, updates, and active platform materials (section 5).  
- **"Your Copies"**: every copy of any Version you have obtained lawfully, in any medium or form: installed packages, package caches, local file storage, private mirrors, Git clones, or forks.  
- **"Modifications"**: alterations to the Product, as well as works based directly upon it, created by you or on your behalf, including extensions and configuration overrides that incorporate substantial, identifiable parts of the Product. A work that merely uses the Product's types, rules, schemas, engine or CLI, without carrying parts of the Product inside it, is Your Artifact and not a Modification.  
- **"Output"**: the tangible end results you produce by executing or operating the Product (such as generated documents, specifications, custom application code, architecture reports, decisions, and analyses), provided such output does not reproduce substantial, identifiable portions of the Product's core architecture, skills, or methods itself.  
- **"Your Tenant OS"**: your specific instance and customized configuration of Leafcutter OS, configured and deployed for you or your organization.

## 3\. Licence grant

3.1 **Perpetual licence.** We grant you a non-exclusive, perpetual, worldwide, non-transferable licence to use every Version of the Product that you obtain lawfully, solely for the permitted purpose set out in section 3.2. For a Version obtained during a Subscription period, the licence is perpetual only if the fee for that period was paid and not refunded or charged back (section 5.5).

3.2 **Permitted purpose.**

- Under a Personal Licence: you may use Leafcutter OS solely for your own direct business operations as an independent professional, freelancer, or sole trader.  
- Under a Business Licence: you may use Leafcutter OS solely for the internal business operations of the single licensed legal entity.  
- Permitted use comprises installing, executing, copying, configuring, adapting, extending, and modifying the Product, and building Your Tenant OS with it.

3.3 **Services and work for clients (Bring-Your-Own-License Principle).** Using Leafcutter OS to deliver professional services to your clients is permitted as part of your internal business operations.

- **Permitted Output:** You may freely license, transfer, or deliver generated Output to your clients.  
- **Prohibited Transfer:** You may not deploy, deliver, sublicense, hand over, or transfer the Product, Your Copies, Modifications, or any Tenant OS containing the Product or its artifacts to any client or third party.  
- **BYOL Exception:** Notwithstanding the above prohibition, you may set up, deploy, and deliver a Tenant OS to a client if, and only if, you have verified prior to delivery that the respective client holds their own active, valid, and direct licence for Leafcutter OS.

3.4 **Authorised Users.** Your Authorised Users may exercise the licence rights strictly on your behalf. You remain fully responsible and liable for ensuring that all Authorised Users strictly comply with this licence.

3.5 **Your Artifacts are yours to publish.** You may author, use, license, sell, and publish Your Artifacts — to your own registry, to a public one, or to anyone you choose — under licence terms of your own choosing, and you owe us no fee, share, approval, or listing for doing so. This holds even though Your Artifacts need the Product to be validated, composed, delivered or executed, and even where they declare our packages as dependencies. Two conditions apply, and only these: Your Artifacts must not carry substantial, identifiable parts of the Product inside them (section 6.1), and whoever installs Your Artifacts needs their own licence for the Product in order to run them (section 6.2).

## 4\. Continuing without upstream (No lock-in)

4.1 **Your Copies are yours to keep.** You have the right to keep, archive, and locally execute Your Copies of any Version obtained during your licence term indefinitely, in any format, including private registry caches, Git repositories, mirrors, and forks. This does not apply to Versions whose licence has lapsed under section 5.5.

4.2 **Independent maintenance.** You may freely modify, refactor, and maintain Your Copies independently for your permitted internal use, without receiving any further Versions, updates, or maintenance from us, and without holding an active Subscription.

4.3 **No technical dependency.** Leafcutter OS does not require recurring online activation, a continuous licence server connection, or phone-home telemetry to function. The expiration, non-renewal, or cancellation of a Subscription does not terminate, alter, or restrict your licence to use any previously obtained Version. The one exception is a refund or chargeback of the fee for a Subscription period, which ends the licence to the Versions obtained during that period (section 5.5).

4.4 **Scope preserved.** Section 4 does not expand the scope of rights granted under section 3\. Your Copies, forks, and Modifications remain strictly subject to the restrictions in section 6\.

## 5\. Subscription & updates

5.1 **Initial subscription included.** Your initial purchase of Leafcutter OS includes a twelve (12) month Subscription starting on the date of purchase. During this active Subscription, you are entitled to receive all new Versions, updates, patches, documentation, and training materials released by us for the Product.

5.2 **Perpetual status of received material.** Every Version, document, or package obtained or downloaded during your active Subscription becomes part of Your Copies and is perpetually licensed pursuant to section 3, provided the fee for that Subscription period was paid and not refunded or charged back (section 5.5).

5.3 **Online services and Academy.** A Subscription grants access to updates, not ongoing services (section 9). Access to interactive online platforms, SaaS portals, or hosted learning environments (such as the online Leafcutter Academy) terminates upon expiration or non-renewal of your Subscription. Any course materials, blueprints, or documentation downloaded locally prior to expiration remain licensed for your continued internal use under section 3, subject to section 5.5.

5.4 **Renewal.** Commercial terms, pricing, and renewal parameters for subsequent Subscription periods are governed by the applicable order form or customer agreement, not by this licence.

5.5 **Refund or chargeback.** If the fee for a Subscription period is refunded or charged back, that Subscription ends immediately, and the licence to every Version, document, or package obtained during that period lapses at the same time. You must permanently delete those copies from Your Copies, including backups, mirrors, and Modifications containing them. Versions obtained during an earlier Subscription period whose fee was paid and not refunded or charged back remain licensed under section 3 and are unaffected.

## 6\. Restrictions (What you may not do)

6.1 **No distribution or redistribution of the Product.** You may not distribute, publish, sell, resell, lease, rent, lend, sublicense, host as a shared service bureau, or otherwise make available **the Product**, Your Copies, Modifications, or substantial parts thereof, to any third party or person who is not an Authorised User. Prohibited acts include:

- publishing or mirroring **our** packages, repositories, or artifacts in public or third-party repositories, registries, or marketplaces;  
- embedding, bundling, or distributing the Product (in whole or part) within another software product, framework, template, or service provided to third parties;  
- copying our artifacts, documentation or rule text into Your Artifacts, in whole or in substantial part, and publishing the result;  
- deploying or transferring a Tenant OS or repository containing Product artifacts to a client, external partner, or affiliated entity that does not hold a separate, direct licence.

This section restricts what **we** authored. It does not restrict Your Artifacts, which section 3.5 permits you to publish, and it does not prevent you from naming our packages as dependencies of Your Artifacts so that whoever installs them resolves the Product from us.

6.2 **Publishing Your Artifacts: what still applies.** Publishing Your Artifacts is permitted (section 3.5), including commercially and including artifact libraries, skill collections and blueprints that compete with ours. Three limits remain:

- **No sublicensing of the Product.** You may not grant anyone rights to the Product. Where Your Artifacts require the Product to run, each recipient needs their own direct licence; say so where you publish them.  
- **No implied endorsement.** You may state factually that Your Artifacts are built for, run on, or are compatible with Leafcutter OS. You may not present them as authored, published, certified, endorsed, or supported by us, and you may not use our name, logo or package scope in a way that suggests it.  
- **No copied substance.** Section 6.1 continues to apply: Your Artifacts carry no substantial, identifiable part of our artifacts, documentation or software.

6.3 **Artificial intelligence and model training.** Running and operating the Product in conjunction with AI models, inference endpoints, and automated agents for your internal business operations is expressly permitted. You may not use the Product, its documentation, or its artifacts to train, retrain, fine-tune, distill, or benchmark machine learning models or AI systems intended to recreate, replicate, or replace the Product itself. Building Your Artifacts with the help of AI, and publishing them, is not affected (sections 3.5 and 6.2). Pursuant to Section 44b(3) of the German Copyright Act (UrhG) and Article 4(3) of EU Directive 2019/790, we explicitly reserve all rights regarding text and data mining for machine learning and AI training purposes.

6.4 **Integrity of notices.** You must preserve, without modification, all copyright notices, proprietary markings, and NOTICE files present in the Product, and reproduce them identically in every copy, fork, and Modification.

6.5 **Prohibition on assignment and transfer.** You may not assign, transfer, or pledge this licence or any rights granted hereunder without our prior written consent. Where mandatory applicable statutory law grants an unwaivable right to transfer perpetual software licences, such transfer is valid only if: (a) the licence is transferred in its entirety to a single commercial acquirer; (b) you permanently delete and destroy all Your Copies, backups, mirrors, and Modifications; and (c) the acquirer expressly accepts all terms of this licence in writing.

## 7\. Intellectual property & ownership

7.1 **Our ownership.** We and our licensors retain all right, title, and interest (including all copyrights, trade secrets, patents, and other intellectual property rights) in and to Leafcutter OS. You receive a contractual right of use, not ownership of the Product.

7.2 **Your Output, Your Artifacts and independent additions.** You own all right, title, and interest in your Output and in Your Artifacts, including those that declare, extend or depend on the Product, and you may license them as you see fit. You also own any distinct, original modifications and extensions authored solely by you; provided, however, that any pre-existing elements, frameworks, or artifacts of the Product embedded within your Modifications remain licensed under and subject to the terms of this licence.

7.3 **Contributions.** If you submit issues, bug fixes, pull requests, artifacts, or suggestions to us, such contributions are governed exclusively by the separate Leafcutter Contribution Terms published with the Product repositories.

## 8\. Third-party components & standards

8.1 The Product may reference or include third-party software or materials. Third-party components remain subject to their respective open-source or commercial licences as identified in the applicable NOTICE or dependency manifest. Nothing in this licence restricts or modifies rights granted to you under applicable third-party open-source licences.

8.2 The Product references industry standards and specifications (e.g., ISO, IEEE, INCOSE, Volere). The Product contains independent implementations and metadata, not the verbatim text of those third-party standards. You are responsible for obtaining legitimate copies or licences directly from standard publishers where required.

## 9\. Disclaimer of warranty & liability

9.1 **Independent review required.** Leafcutter OS provides automated structures, methods, and drafts. You are solely responsible for reviewing, testing, and verifying all Output and configurations prior to deploying them or relying upon them in business operations.

9.2 **As-is provision / No service warranty.** The Product is provided as a licensed copyright work. We owe no availability, uptime, support, maintenance, or consulting services under this licence. The uninterrupted availability of package registries or download infrastructure is not warranted.

9.3 **Warranty limitations.** For any Version acquired for consideration, our warranty for defects is governed by statutory German B2B law, with the following limitation: claims for minor or insignificant defects that do not substantially impair the agreed functionality are excluded.

9.4 **Limitation of liability.**

- We are liable without limitation for damages resulting from intent (*Vorsatz*), gross negligence (*grobe Fahrlässigkeit*), injury to life, body, or health, under the German Product Liability Act (*Produkthaftungsgesetz*), and in cases of fraudulent concealment (*arglistiges Verschweigen*) or explicit guarantee (*Garantieübernahme*).  
- For damages caused by slight negligence (*einfache Fahrlässigkeit*), we are liable only in the event of a breach of an essential contractual duty (*Kardinalpflicht*), limited in amount to the typical, foreseeable damage at the time of contract execution.  
- Any further liability for damages or financial loss is excluded.

## 10\. Patents

10.1 **Patent grant.** We grant you a non-exclusive, worldwide, royalty-free patent licence under any patent claims owned or licensable by us that are necessarily infringed by the operation of the Product as expressly permitted hereunder.

10.2 **Defensive patent termination.** If you, your organization, or any of your Authorised Users initiate, maintain, or participate in any patent infringement litigation, legal proceeding, or claim against us or any licensee alleging that Leafcutter OS (or any part thereof) infringes any patent, all licences granted to you under this agreement—including both patent and copyright licences—shall terminate immediately and automatically without notice.

## 11\. Breach and termination

11.1 **Cure period.** In the event of an initial breach of this licence by you, we will issue written notice specifying the violation. The licence remains in effect if you cease the breach and take verifiable, practical steps to remedy it within thirty (30) days of receiving such notice.

11.2 **Termination for cause.** If you fail to cure the breach within thirty (30) days, or if you commit a second or severe non-curable breach, we reserve the right to immediately terminate this licence for cause. Upon termination, you must cease all use of the Product and permanently delete all of Your Copies, local archives, and Modifications containing Product artifacts. Your generated Output remains unaffected.

11.3 Sections 7, 9, 11, and 12 shall survive any termination of this licence.

## 12\. General provisions

12.1 **Governing law and venue.** This licence and all disputes arising out of or in connection with it shall be governed by and construed in accordance with the laws of the Federal Republic of Germany, excluding the United Nations Convention on Contracts for the International Sale of Goods (CISG). Exclusive jurisdiction and venue for all disputes with merchants (*Kaufleute*), legal entities under public law, or special funds under public law shall lie with the competent courts in Berlin, Germany.

12.2 **Commercial B2B restriction.** This licence is intended exclusively for business transactions with commercial enterprises, freelancers, and legal entities (§ 14 BGB). If you are acting as a consumer (§ 13 BGB), you are not permitted to enter into this agreement or use the Product.

12.3 **Binding language.** The English language version of this licence is the sole legally binding and authoritative version. Any convenience translations provided in German or other languages serve informational purposes only.

12.4 **Licence versions.** Each release of the Product designates the version of the licence under which it is delivered. The licence version applicable at the time you obtained a specific Version remains applicable to that specific Version.

12.5 **Severability.** Should any provision of this licence be or become invalid, illegal, or unenforceable, the validity of the remaining provisions shall not be affected. The invalid provision shall be replaced by a valid provision that most closely reflects the commercial and legal intent of the original provision.  
