---
title: "Minimum wage under incentive pay"
description: "How to test hourly, piece-rate, commission, and mixed pay against federal and California floors without averaging away time outside the promised pay unit."
section: "issues"
question: "Which minimum-wage floor applies to each hour and compensation unit in an incentive-pay period?"
analysisStep: "measure"
jurisdictions: ["california", "federal"]
sourceChecked: "2026-07-18"
checkScope: "Federal workweek minimum-wage principles; California wage-order selection, 2026 statewide floor, Oman no-borrowing analysis, and piece-rate intersections."
nextCheck: "2026-10-15"
authorityIds: ["flsa-6", "cfr-785", "ca-labor-1197", "ca-labor-1194", "ca-labor-226-2", "wage-order-7", "wage-order-9", "mw-2026", "dir-which-order", "oman"]
evidenceDomains: ["time", "system", "output", "pay", "plan", "establishment"]
order: 2
related: ["/pay-plans/flat-rate-technicians/", "/pay-plans/commissioned-sales/", "/issues/rest-period-nonproductive-pay/", "/issues/off-the-clock/"]
---

## Question presented

Did the pay system assign at least the governing minimum wage to every covered hour and every compensation unit, or does a favorable period total conceal time outside the unit the plan promised to pay? The question is narrower than whether total earnings looked adequate. It requires the location and date, the applicable wage order, all hours worked, the substance of each pay component, and the unit each component covers.

That distinction is especially important for dealership technicians paid by flagged or book hours. A technician can earn more than the minimum wage in the aggregate while waiting, attending a meeting, completing general training, or performing another controlled activity that the piece formula does not cover. Conversely, California does not require a separate pay code for every task when a lawful compensation agreement genuinely covers each increment of work. The analysis must identify the promised unit before judging the arithmetic.

## Rule architecture

**Choose the governing floor first.** California's statewide minimum wage is **$16.90 per hour beginning January 1, 2026**. The applicable rate can be higher because of a city, county, industry, or later-effective rule. The statewide figure is therefore an input for the right date and location, not a universal answer. The federal floor remains **$7.25 per hour** as of the source-check date. An employee receives the more protective applicable obligation; satisfying the federal floor does not satisfy a higher California or local floor.

**Choose the wage order from establishment facts.** Dealer- or gas-station-connected vehicle repair generally routes to IWC Wage Order 7. A standalone vehicle-repair garage generally routes to Wage Order 9. The DIR classification guide is useful but not a safe harbor. Entity structure, the business conducted at the establishment, and the repair operation's connection to a dealer matter. Both orders define hours worked through employer control and suffered-or-permitted work and require minimum pay for all covered hours.

**Keep the federal and California measurement methods separate.** Federal minimum-wage analysis generally examines covered compensation over the workweek, after determining all compensable hours and which payments count. That orientation does not displace California's rule that compensation promised for one unit cannot be borrowed to pay a different, otherwise unpaid unit.

In *Oman v. Delta Air Lines*, the California Supreme Court framed two questions: what unit does the compensation contract promise to cover, and is there work outside that unit without required pay? A contract may pay by task, rotation, or another unit. If it genuinely compensates every increment within the unit and the translated rate meets the floor, California does not demand a separate rate for each duty. But high earnings assigned to one repair cannot simply be averaged across waiting time the plan never covered.

**Piece-rate periods add a statutory layer.** When any piece-rate work occurs in a pay period, Labor Code section 226.2 separately governs rest/recovery and other nonproductive time. Those payments do not replace the threshold inquiry under *Oman*, and an aggregate minimum-wage top-up is not the same as section 226.2(a)(7)'s hourly base paid for every hour in addition to piece earnings. Overtime and its regular rate are separate calculations again.

## Decision sequence

1. Fix the employer, establishment, worksite, dates, workday, and workweek. Select Wage Order 7 or 9 and the highest applicable state or local floor for each date.
2. Reconstruct hours worked. Start with raw punches, then test for controlled or suffered-permitted activity outside them. Do not use payroll hours as a substitute for this factual step.
3. Classify each component by formula and function: hourly wage, piece or flat rate, commission, draw, guarantee, bonus, spiff, premium, or later true-up. Payroll labels are evidence, not conclusions.
4. Read the governing plan version and identify the promised pay unit. Ask which activities fall inside it and which do not. Compare written terms with actual practice.
5. Apply *Oman* to each covered unit and to time outside it. Translate the promised compensation into an hourly measure where needed, using the correct hours rather than the entire pay period by default.
6. If piece-rate work occurred, partition rest/recovery, other nonproductive time, and productive piece activity. Apply section 226.2's separate rates and statement rules.
7. Run federal minimum wage, California minimum wage, overtime, regular-rate, wage-statement, and recordkeeping analyses as distinct branches. A result in one branch does not decide the others.

## Evidence map

**Time records** establish recorded intervals, facial meal timing, and edits. Pull raw punches rather than a rounded payroll summary, along with schedules and the edit audit trail. They do not establish all controlled time if work occurred before or after a punch.

**Plan records** identify the promised unit, formula, guarantee, and effective version. A signed plan does not prove actual practice. Compare it with **output records** such as repair orders, flag ledgers, parts tickets, warranty events, and test-drive records. A flag ledger establishes credited output; it does not establish all hours worked.

**System activity**—DMS events, OEM training, workstation access, alarm data, and messages—can corroborate activity, sequence, regularity, and employer knowledge. A timestamp at 8:07 does not prove continuous work from 8:07 until the next event. Alternative explanations such as an automated event, personal early arrival, or activity already included in a repair unit must be tested.

**Pay records** show amounts, rates, earning codes, and later adjustments. Reconcile the payroll register to wage statements and the formula in force. A large gross amount does not show which time it compensated. **Establishment records** resolve the wage-order branch; a job title or shared brand alone may not.

## Worked example

Assume a dealer-connected technician works five eight-hour days, totaling 40 hours in one 2026 workweek. The applicable local rate does not exceed the statewide $16.90 floor. The technician earns $900 under a book-hour formula. Matching records support 34 hours directly related to piece-paid repairs, five hours of controlled waiting and general meetings, and one hour of authorized rest/recovery. The five-day assumption removes overtime solely to isolate the minimum-wage and section 226.2 layers.

The first shortcut would divide $900 by 40 and report $22.50 per hour. That does not answer the California question. The plan must be read to determine whether it promised the $900 for all 40 hours or only for completed repairs. If it covers only repairs, the five meeting/waiting hours sit outside that unit and section 226.2 treats them as other nonproductive time, assuming they were not directly related to a paid repair.

Without an additional hourly-base safe harbor, NPT pay is at least **5 × $16.90 = $84.50**. The weekly average for the rest-rate calculation, using the simplified facts, is **($900 + $84.50) ÷ 39 non-rest hours = $25.24** after rounding. Because $25.24 exceeds $16.90, one rest hour receives $25.24. The displayed section 226.2 layers total $1,009.74, before any separate overtime, local-rate, statement, or remedy analysis.

Change one fact and the route changes. If the dealer paid a genuine $16.90 hourly base for all 40 hours in addition to the $900 piece earnings, section 226.2(a)(7) may satisfy the NPT-pay branch. Rest/recovery still needs separate treatment at the statutory rate. A guarantee that merely tops total pay up to a period floor when flags are low is not that additive hourly base.

## Strategic implications

**For dealers:** define the paid unit in plain operational terms and make payroll match it. Configure separate earning codes for statutory categories, preserve raw time and production data, and reconcile the same workweek from plan to punch to repair order to payroll. Before relying on section 226.2(a)(7), verify that the hourly base is paid for every hour in addition to piece earnings—not later netted against them. Test local rates by worksite and effective date.

**For workers:** build a matching-date packet rather than relying on a low or high gross total. Preserve the plan, all statement pages, personal time notes, repair-order details, and examples of meetings, waiting, training, or closing work. Identify what the plan said each flag paid for. A gap between presence and flags is a question to classify, not by itself proof that every minute was NPT.

For both sides, the highest-value dispute often concerns the denominator and the promised unit, not arithmetic. State the competing interpretations and identify which record would distinguish them.

## Analysis limits

This framework does not select a local minimum wage, determine joint employment, decide an exemption, or establish the amount of work from isolated timestamps. It does not assume that every non-flagged interval is outside the piece unit, or that every task needs a separate line. It also does not calculate overtime, section 226.2 rest pay, break premiums, statement penalties, waiting-time penalties, interest, or limitation periods without their additional predicates. The law and rates are checked through July 18, 2026; later legislation, local rules, or decisions require a new source check.

## Primary authority

- [29 U.S.C. § 206](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title29-section206&num=0&edition=prelim) — federal minimum-wage obligation.
- [Labor Code § 1197](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=1197) and [§ 1194](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=1194) — California minimum-wage rule and recovery framework.
- [California Minimum Wage Order for 2026](https://www.dir.ca.gov/Iwc/MW-2026.pdf) — $16.90 statewide floor effective January 1, 2026, subject to higher applicable law.
- [IWC Wage Order 7](https://www.dir.ca.gov/t8/11070.html), [Wage Order 9](https://www.dir.ca.gov/t8/11090.html), and the [DIR classification guide](https://www.dir.ca.gov/dlse/whichiwcorderclassifications.pdf) — hours, pay, and establishment routing.
- [Labor Code § 226.2](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=226.2) — piece-rate rest/recovery and nonproductive-time rules.
- [*Oman v. Delta Air Lines*, 9 Cal.5th 762, 781–791 (2020)](https://www.courts.ca.gov/opinions/archive/S248726.PDF) — compensation-unit and no-borrowing analysis.
