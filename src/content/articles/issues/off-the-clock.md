---
title: "Off-the-clock work"
description: "How to test control, suffered-permitted work, employer knowledge, recordability, and short-duration activity without turning isolated timestamps into conclusions."
section: "issues"
question: "Which pre-shift, post-shift, remote, waiting, inspection, or system activity counts as compensable work, and how can its amount be reconstructed?"
analysisStep: "facts"
jurisdictions: ["california", "federal"]
sourceChecked: "2026-07-18"
checkScope: "Federal and California hours-worked principles, knowledge and reconstruction, short-duration work, inspections, piece-rate classification, and current rounding status."
nextCheck: "2026-10-15"
authorityIds: ["cfr-516-2", "cfr-785", "dol-2026-8", "ca-labor-1174", "ca-labor-510", "ca-labor-226-2", "wage-order-7", "wage-order-9", "donohue", "troester", "frlekin", "huerta", "furry"]
evidenceDomains: ["time", "system", "output", "pay", "plan", "establishment"]
order: 6
related: ["/issues/minimum-wage/", "/issues/meal-rest-breaks/", "/pay-plans/flat-rate-technicians/", "/pay-plans/service-advisors/"]
---

## Question presented

Did work occur beyond recorded payroll time because the employer controlled the interval, suffered or permitted the activity, or knew or should have known it was being performed? If so, what reliable method measures the time, what compensation category covers it, and what additional minimum-wage, overtime, piece-rate, record, or statement question follows?

“Off the clock” identifies a mismatch, not a conclusion. A pre-punch DMS event may be work, automation, or voluntary access; a flag gap may be waiting, repair work, a break, or personal time. Start with activity and control, not preset minutes.

## Rule architecture

**California hours worked.** Wage Orders 7 and 9 define hours worked to include time the employee is subject to employer control and time the employee is suffered or permitted to work. The tests are independent. Control examines constraints imposed by the employer; suffer-or-permit reaches work the employer knew or should have known was occurring. Mandatory meetings, opening and closing tasks, required training, customer follow-up, tool or key procedures, and work through a device may qualify when the facts satisfy a test.

*Frlekin v. Apple* treated mandatory onsite exit searches as work because employees were confined, had to follow an employer procedure, faced discipline, and served an employer benefit. *Huerta v. CSI Electrical* similarly treated waiting for and undergoing a mandated exit vehicle inspection on controlled premises as compensable, while ordinary onsite driving subject to workplace rules was not automatically work on the facts presented. Location, degree of control, required procedure, benefit, discipline, and practical freedom matter; the word “security” or “commute” does not decide the result.

**Federal lane.** Federal regulations address suffered-permitted work, employer knowledge, waiting, training, travel, breaks, and preliminary or postliminary activity. WHD's 2026 guidance treats regular, known, practically recordable pre-shift activity as unlikely to be de minimis and discusses neutral rounding in operation. It remains federal agency guidance. The federal result may be narrower than California's control test, and a federal overtime exemption does not erase minimum-wage or record duties or decide California law.

**Short-duration work and recordability.** In *Troester v. Starbucks*, California declined to import the federal de minimis doctrine to excuse regularly required, recordable minutes of post-clock work. The court did not establish a universal seconds-or-minutes threshold and left open truly minute or irregular time that is unreasonable to capture. The relevant inquiry therefore includes activity type, regularity, aggregate duration, employer knowledge, and practical capture methods. A policy instructing employees to report all time is relevant but not decisive if supervisors require contrary work or the reporting system makes capture impracticable.

**Rounding status.** Meal punches may not be rounded under *Donohue*. General time rounding presents a different question, and the California authorities mapped to this guide do not supply a categorical rule for every non-meal practice. A current, issue-specific authority check is necessary before relying on rounding. Exact capture, retention of raw punches, and a complete edit trail avoid making the wage analysis depend on that unresolved branch.

**Classification after capture.** Once an interval is hours worked, determine how it was paid. For a piece-rate employee, off-clock activity may be directly related to a paid repair or may be other nonproductive time under section 226.2. It is not NPT merely because no flag posted. Minimum wage, overtime, regular rate, statement, and recordkeeping remain separate branches.

## Decision sequence

1. Identify the exact activity, actor, date, location, duration, and instruction. Separate pre-shift, post-shift, remote, waiting, inspection, training, travel, and interrupted-break patterns.
2. Select Wage Order 7 or 9 from establishment facts. Apply California control and suffer-or-permit tests independently; then run the federal activity and knowledge route separately.
3. Test employer knowledge through policy, manager instructions, observation, recurring reports, system data, workload, and whether a reasonable reporting channel existed and worked in practice.
4. Test regularity and capture feasibility without imposing a fixed-minute threshold. Preserve raw rather than rounded data and identify every edit.
5. Build a reasonable duration method. Use matched events and known task lengths; do not assume continuous work between isolated system timestamps.
6. Reconcile reconstructed time with paid time. If piece work occurred, classify the interval as directly related productive activity, rest/recovery, or NPT based on the plan and work.
7. Recompute the affected workweek's straight time, daily and weekly overtime, regular rate, and records. Analyze remedies and mental states only after those predicates.

## Evidence map

**Time evidence** includes raw punches, schedules, rounding settings, edits, approvals, and audit trails. Compare source events with processed payroll. A schedule does not prove work began then; a punch does not exclude known work outside it.

**System evidence** includes DMS/CRM, repair orders, training, access, logins, calls, and messages. Repeated matched events can support sequence, regularity, knowledge, and duration. One event does not show continuous work. Check automation, shared credentials, clock accuracy, and personal activity.

**Output evidence** connects activity to a pay unit but does not capture waiting or all controlled time. **Plan evidence** shows required tasks, reporting procedures, piece-unit boundaries, and discipline. Compare policy with manager messages and actual corrections.

**Pay evidence** shows accounted hours, rates, piece earnings, overtime, and true-ups. A later payment may correct wages while leaving record or statement questions. Missing required records can permit a just and reasonable inference under *Furry*, but the worker still needs a reasonable evidentiary basis and the employer may rebut it with precise proof.

## Worked example

Assume a technician is scheduled and punched from 8:00 a.m. to 4:30 p.m. on 12 sampled days. A written checklist requires attendance at a 7:55–8:00 huddle. DMS records show the technician's credential active around 7:54, and managers regularly distribute work at the huddle. The technician punches out at 4:30, while a required key/tool exit log shows a 4:32–4:38 procedure. Payroll contains no adjacent time or correction.

The DMS timestamp alone does not prove work from 7:54. It could be automated or shared. The checklist, repeated manager presence, work distribution, and witness or message evidence could support a five-minute pre-shift interval. The exit log plus a mandatory, disciplined procedure presents stronger control evidence under *Frlekin* and *Huerta*. If the matched proof supports five pre-shift and six post-shift minutes on each of 12 days, the reconstruction is **11 × 12 = 132 minutes, or 2.2 hours**.

At a $20 straight-time rate, $44 is the first arithmetic layer, not a final amount. Some minutes may fall in a daily or weekly overtime period. Incentive earnings may affect the regular rate. If the technician is piece-paid, huddle and exit time may be NPT if controlled and not directly related to a repair, but the plan and actual tasks must decide. Minimum-wage, section 226.2, statement, and record consequences each need their own test.

Alternative evidence can change the result: the huddle may be optional with no work assigned before 8:00; the credential event may be automated; the exit log may record personal tool storage after release; or payroll may contain a later true-up. The analysis should show which assumption drives each included minute.

## Strategic implications

**For dealers:** place required huddles, setup, training, inspections, and closing inside exact punches. Allow unscheduled-time reports without gatekeeping, review time/system conflicts, retain source punches and correction history, and investigate patterns by activity and manager.

**For workers:** record activity, instruction, start/end, location, knowledge, and corroborating events. Preserve matching schedules, messages, training, repair orders, and statements where lawful. Do not claim an entire timestamp gap without evidence; a narrower reproducible method is stronger.

Both sides should separate correction from explanation. Paying a verified interval can address one wage layer, while accurate records, regular-rate effects, and root-cause controls still require attention. Conversely, a timestamp discrepancy can be explained without assuming a wage shortfall when reliable evidence shows no work.

## Analysis limits

This guide does not establish a universal de minimis threshold, a final statewide rule for general time rounding, or continuous work from isolated digital events. It does not mechanically transfer construction-specific travel or CBA holdings from *Huerta* to a dealership. It does not decide employer coverage, exemption, joint employment, local rates, willfulness, penalties, limitation periods, or a classwide method. All mapped authorities are checked through July 18, 2026; later authority can change the rounding discussion.

## Primary authority

- [29 C.F.R. Part 785](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-785) and [29 C.F.R. § 516.2](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-516/subpart-A/section-516.2) — federal hours-worked and record principles.
- [IWC Wage Order 7](https://www.dir.ca.gov/t8/11070.html), [Wage Order 9](https://www.dir.ca.gov/t8/11090.html), and [Labor Code § 1174](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=1174) — California hours and record framework.
- [*Troester v. Starbucks*, 5 Cal.5th 829, 835–848 (2018)](https://www.courts.ca.gov/opinions/archive/S234969.PDF) — regularly required short-duration work and no universal minute threshold.
- [*Frlekin v. Apple*, 8 Cal.5th 1038, 1046–1057 (2020)](https://www.courts.ca.gov/opinions/archive/S243805.PDF) — mandatory onsite exit searches under the control test.
- [*Huerta v. CSI Electrical Contractors*, 15 Cal.5th 908 (2024)](https://www.courts.ca.gov/opinions/archive/S275431.PDF) — exit inspections and limits of onsite-control reasoning.
- [*Furry v. East Bay Publishing*, 30 Cal.App.5th 1072, 1080–1084 (2018)](https://www.courts.ca.gov/opinions/archive/A151986.PDF) — reasonable inference when required time records are missing.
- [*Donohue v. AMN Services*, 11 Cal.5th 58, 68–78 (2021)](https://www.courts.ca.gov/opinions/archive/S253677.PDF) — meal rounding only; it did not decide general rounding.
- [WHD FLSA2026-8](https://www.dol.gov/sites/dolgov/files/WHD/opinion-letters/FLSA/FLSA2026-8.pdf) — current federal guidance on short-duration work and neutral rounding; it does not decide California law.
