import type { JSX } from "react";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateISO: string;
  readTime: string;
  keywords: string[];
  Content: () => JSX.Element;
};

// ─── Shared prose helpers ───────────────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-extrabold text-slate-800 mt-10 mb-3">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600 leading-relaxed mb-4">{children}</p>;
}
function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5">{children}</ul>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="text-sm text-slate-600 leading-relaxed">{children}</li>;
}
function CTA() {
  return (
    <div className="mt-10 rounded-2xl bg-[#C2955A]/10 border border-[#C2955A]/30 px-6 py-5 text-center">
      <p className="text-sm font-bold text-slate-800 mb-1">Start saving with Gullak.Online — it&apos;s free</p>
      <p className="text-xs text-slate-500 mb-3">Set your first savings goal in under a minute. No subscription, no credit card.</p>
      <a
        href="/"
        className="inline-block bg-[#C2955A] hover:bg-[#A67840] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
      >
        Open Gullak.Online →
      </a>
    </div>
  );
}

// ─── Blog posts ─────────────────────────────────────────────────────────────

const posts: BlogPost[] = [
  {
    slug: "how-to-save-money-in-india",
    title: "How to Save Money in India: A Practical Guide for 2026",
    description:
      "Practical, actionable tips for saving money in India in 2026 — from the 50-30-20 rule to goal-based savings and monthly contribution planners.",
    date: "June 5, 2026",
    dateISO: "2026-06-05",
    readTime: "6 min read",
    keywords: [
      "how to save money in India",
      "money saving tips India",
      "savings tips India 2026",
      "personal finance India",
      "monthly savings plan India",
    ],
    Content() {
      return (
        <>
          <P>
            Saving money in India has never been more important — or more challenging. Rising costs, EMIs, and lifestyle inflation
            eat into every paycheck. Yet most Indians have no structured savings plan. If you&apos;ve been wanting to start saving
            seriously but don&apos;t know where to begin, this guide is for you.
          </P>

          <H2>Why most Indians struggle to save</H2>
          <P>
            The biggest enemy of savings is not low income — it&apos;s spending everything that&apos;s left after expenses and
            assuming you&apos;ll &quot;save what remains.&quot; Savings that aren&apos;t planned rarely happen. The solution is to
            <strong> pay yourself first</strong>: decide how much you&apos;re saving <em>before</em> you decide what you&apos;re spending.
          </P>

          <H2>The 50-30-20 rule adapted for India</H2>
          <P>
            The classic 50-30-20 budgeting rule is a solid starting point:
          </P>
          <UL>
            <LI><strong>50% of take-home pay</strong> → needs (rent, groceries, EMIs, utilities, transport)</LI>
            <LI><strong>30% of take-home pay</strong> → wants (eating out, entertainment, shopping, travel)</LI>
            <LI><strong>20% of take-home pay</strong> → savings and investments</LI>
          </UL>
          <P>
            In Indian metros where rent alone can be 30–40% of income, you may need to adjust this to 60-20-20 or 65-15-20.
            The point is not the exact split — it&apos;s having a plan at all.
          </P>

          <H2>Step 1 — Know exactly what you spend</H2>
          <P>
            Before you can save, you need to know where your money goes. Track every expense for one month — UPI, cash, credit
            card. Most people are shocked to discover they spend ₹4,000–₹8,000 a month on eating out, subscriptions, and impulse
            buys they barely remember. Awareness is the first step to change.
          </P>

          <H2>Step 2 — Set specific savings goals, not vague intentions</H2>
          <P>
            &quot;I want to save more money&quot; is not a goal. &quot;I want to save ₹1,20,000 for a trip to Europe by December
            2026&quot; is a goal. Specific goals are motivating because you can measure progress. Every time you deposit ₹10,000
            toward your Europe trip, you know you&apos;re 8.3% closer.
          </P>
          <P>
            Break each goal into a monthly contribution: if you need ₹1,20,000 in 12 months, that&apos;s ₹10,000 per month.
            Now you have a number to aim for — not a vague wish.
          </P>

          <H2>Step 3 — Automate or schedule transfers</H2>
          <P>
            Set a recurring transfer to a separate savings account on payday. If the money never hits your spending account, you
            won&apos;t spend it. Most Indian banks support standing instructions for free. Even ₹2,000 a month adds up to ₹24,000
            a year — plus interest.
          </P>

          <H2>Step 4 — Track your progress visually</H2>
          <P>
            Progress tracking keeps you motivated. When you see your savings balance grow month by month, you feel accomplished
            and are less likely to dip into it. Use a simple tool — a spreadsheet, a notebook, or a dedicated savings tracker
            like Gullak.Online — to log every deposit and see how close you are to your goal.
          </P>

          <H2>Common savings mistakes to avoid</H2>
          <UL>
            <LI><strong>No emergency fund first</strong> — without 3–6 months of expenses set aside, any unexpected event derails all your other goals.</LI>
            <LI><strong>Saving what&apos;s left over</strong> — decide the savings amount first; spend the rest.</LI>
            <LI><strong>Mixing goal money with daily spending</strong> — keep savings in a separate account or at least a separate mental bucket.</LI>
            <LI><strong>No written target date</strong> — without a deadline, savings drift indefinitely.</LI>
            <LI><strong>Giving up after one bad month</strong> — missing a month is okay; restart next month.</LI>
          </UL>

          <H2>Simple tools for saving money in India</H2>
          <P>
            You don&apos;t need a complex financial app. The most effective tools are the ones you actually use:
          </P>
          <UL>
            <LI>A <strong>digital savings tracker</strong> like Gullak.Online — create goals, set monthly targets, and watch your progress visually</LI>
            <LI><strong>Google Sheets</strong> or a notebook — for tracking monthly income and expenses</LI>
            <LI><strong>Separate savings account</strong> — at a different bank from your salary account, so transfers feel intentional</LI>
            <LI><strong>Liquid mutual funds or RD</strong> — for earning interest on money you don&apos;t need immediately</LI>
          </UL>

          <H2>The bottom line</H2>
          <P>
            Saving money in India in 2026 comes down to three things: know where your money goes, set specific goals with monthly
            contribution targets, and track your progress consistently. Start small — even ₹500 a month matters. The habit is more
            important than the amount.
          </P>
          <CTA />
        </>
      );
    },
  },

  {
    slug: "what-is-a-gullak",
    title: "What is a Gullak (गुल्लक)? India's Original Piggy Bank, Now Digital",
    description:
      "The gullak is India's beloved piggy bank — a symbol of disciplined saving. Learn the history of the गुल्लक, why it matters, and how Gullak.Online brings this tradition into the digital age.",
    date: "May 28, 2026",
    dateISO: "2026-05-28",
    readTime: "5 min read",
    keywords: [
      "what is gullak",
      "गुल्लक",
      "gullak meaning",
      "piggy bank India",
      "digital gullak",
      "gullak app India",
      "Indian piggy bank",
    ],
    Content() {
      return (
        <>
          <P>
            If you grew up in India, you almost certainly had a <strong>गुल्लक</strong> — a clay pot or colourful plastic box
            with a coin slot at the top. Every time you received money as a gift or had change left over, it went into the
            gullak. You weren&apos;t allowed to take it out until it was full. That was the rule.
          </P>
          <P>
            The gullak is more than a piggy bank. It&apos;s a philosophy: <em>save first, spend what&apos;s left.</em>
          </P>

          <H2>The origin of the गुल्लक</H2>
          <P>
            The word <em>gullak</em> comes from the Hindi/Urdu root, and traditionally referred to a terracotta (clay) pot
            used to store coins. These matka-style pots were cheap, widely available, and — crucially — had no way to retrieve
            money without breaking them. That deliberate friction was the point: saving felt permanent, and spending felt
            irreversible.
          </P>
          <P>
            For generations of Indian families, the gullak was how you saved for Diwali shopping, a sibling&apos;s wedding gift,
            school fees, or a special purchase. Children learned the value of delayed gratification not from lectures but from
            the satisfying <em>clink</em> of a coin disappearing into the slot.
          </P>

          <H2>Why the gullak worked so well</H2>
          <P>
            Behavioural economists have a term for what the gullak exploits: <strong>commitment devices</strong>. By making
            withdrawals intentionally difficult (you had to break the pot), the gullak removed the temptation to dip into
            savings for impulse purchases. Research consistently shows that people save more when their savings are separate
            from their spending money — the gullak enforced this physically.
          </P>
          <UL>
            <LI><strong>Visual progress</strong> — you could feel the pot getting heavier, which gave a sense of accumulation</LI>
            <LI><strong>Goal-linked saving</strong> — you saved for a specific purpose, not just abstractly</LI>
            <LI><strong>No temptation to withdraw</strong> — breaking the pot was a psychological barrier</LI>
            <LI><strong>Simple and universal</strong> — no bank account, no paperwork needed</LI>
          </UL>

          <H2>The problem with the physical gullak today</H2>
          <P>
            India has gone cashless. Most transactions — salary, rent, groceries, shopping — happen digitally via UPI, NEFT,
            or credit cards. There&apos;s very little physical change to drop into a clay pot. The <em>concept</em> of the gullak
            remains brilliant; the <em>format</em> is outdated.
          </P>
          <P>
            At the same time, modern financial apps have swung too far the other way — filled with investment jargon, stock
            tickers, and features nobody asked for. Most Indians just want to answer a simple question: <em>How much have I
            saved toward my goal, and how much do I need each month?</em>
          </P>

          <H2>The digital गुल्लक</H2>
          <P>
            Gullak.Online brings the gullak into the digital age. Instead of a clay pot, you create a digital savings goal
            (called a gullak). Instead of dropping coins in a slot, you log deposits. Instead of feeling the pot get heavier,
            you watch an animated piggy bank fill up as your savings grow.
          </P>
          <P>
            The core philosophy is unchanged: a <strong>specific goal</strong>, a <strong>target amount</strong>, and a
            <strong> monthly plan</strong> to get there — with progress you can see and feel.
          </P>

          <H2>Who is Gullak.Online for?</H2>
          <UL>
            <LI>Anyone saving for a vacation, gadget, wedding, home renovation, or any other goal</LI>
            <LI>People building an emergency fund and want to track it separately from their regular savings</LI>
            <LI>Those who want a simple, private, ad-free tool — not a complex fintech app</LI>
            <LI>Anyone who grew up with a गुल्लक and misses the satisfaction of watching savings grow</LI>
          </UL>

          <H2>The tradition continues</H2>
          <P>
            The gullak was India&apos;s first financial product. It predates banks, mutual funds, and UPI by centuries. The
            principle it taught — save deliberately, spend what&apos;s left — remains the soundest financial advice there is.
            Gullak.Online just adds a digital piggy bank, a progress bar, and a monthly contribution calculator.
          </P>
          <CTA />
        </>
      );
    },
  },

  {
    slug: "emergency-fund-india",
    title: "Emergency Fund India: How Much to Save and How to Start in 2026",
    description:
      "An emergency fund is the foundation of financial security. Learn how much you need, where to keep it, and how to build one month by month — with practical advice for India in 2026.",
    date: "May 20, 2026",
    dateISO: "2026-05-20",
    readTime: "7 min read",
    keywords: [
      "emergency fund India",
      "how much emergency fund India",
      "emergency savings India",
      "financial safety net India",
      "emergency fund calculator India",
      "how to build emergency fund India",
    ],
    Content() {
      return (
        <>
          <P>
            An emergency fund is money set aside specifically for unexpected, urgent expenses — a job loss, a medical bill,
            a major appliance breakdown, or a family emergency. Without one, any shock to your finances forces you to break
            long-term savings, take on debt, or ask family for money. With one, you handle surprises without disrupting your
            financial life.
          </P>
          <P>
            An emergency fund is not an investment, not a vacation fund, and not for expected expenses. It is purely a
            <strong> financial safety net</strong> — and it is the single most important savings goal you should build first.
          </P>

          <H2>How much do you need?</H2>
          <P>
            The standard advice is <strong>3 to 6 months of essential monthly expenses</strong>. Essential expenses means:
            rent/EMI, groceries, utilities, transport, insurance premiums, and any fixed monthly obligations. It does
            <em> not</em> include dining out, shopping, or entertainment — those can be paused in a crisis.
          </P>
          <P>
            Here&apos;s a quick way to estimate:
          </P>
          <UL>
            <LI>Write down your monthly rent/EMI</LI>
            <LI>Add monthly grocery and household expenses</LI>
            <LI>Add monthly transport costs</LI>
            <LI>Add health insurance premiums (monthly equivalent)</LI>
            <LI>Add any other unavoidable monthly payments</LI>
          </UL>
          <P>
            Multiply that total by 3 (conservative) or 6 (recommended). That is your emergency fund target.
          </P>
          <P>
            <strong>Example:</strong> Monthly essential expenses of ₹25,000 × 6 months = ₹1,50,000 emergency fund target.
          </P>

          <H2>Who needs a bigger emergency fund?</H2>
          <P>
            Aim for 6 months (or more) if:
          </P>
          <UL>
            <LI>You are self-employed, a freelancer, or run a business</LI>
            <LI>Your income is irregular or commission-based</LI>
            <LI>You are the sole earning member of your household</LI>
            <LI>Your industry is volatile or your job feels uncertain</LI>
            <LI>You have dependents (elderly parents, children, spouse not earning)</LI>
          </UL>
          <P>
            Salaried employees in stable jobs can start with 3 months.
          </P>

          <H2>Where to keep your emergency fund in India</H2>
          <P>
            Emergency funds must be:
          </P>
          <UL>
            <LI><strong>Liquid</strong> — accessible within 1–3 days, no lock-in</LI>
            <LI><strong>Safe</strong> — not in the stock market or volatile assets</LI>
            <LI><strong>Separate</strong> — not in your salary account (to avoid accidental spending)</LI>
          </UL>
          <P>
            Best options for emergency funds in India:
          </P>
          <UL>
            <LI><strong>High-yield savings account</strong> — a separate account at a small finance bank (Equitas, ESAF, Jana, etc.) offering 6–7% interest, instantly accessible via UPI</LI>
            <LI><strong>Liquid mutual funds</strong> — redeemable in 1 business day, earn 6.5–7.5%, no exit load after 7 days</LI>
            <LI><strong>Overnight funds</strong> — even safer than liquid funds, suitable for the core emergency amount</LI>
            <LI><strong>Short-term FD with sweep facility</strong> — some banks allow auto-sweep FDs linked to your savings account</LI>
          </UL>
          <P>
            Avoid: fixed deposits with lock-ins, equity mutual funds, or chit funds for your emergency fund. Speed and
            certainty matter more than returns.
          </P>

          <H2>How to build your emergency fund step by step</H2>
          <P>
            Building ₹1,50,000 feels overwhelming. Breaking it into monthly steps makes it concrete:
          </P>
          <UL>
            <LI>Set your target (e.g. ₹1,50,000)</LI>
            <LI>Set a timeline (e.g. 12 months)</LI>
            <LI>Calculate monthly contribution: ₹1,50,000 ÷ 12 = ₹12,500/month</LI>
            <LI>Transfer ₹12,500 on payday — before spending anything else</LI>
            <LI>Track your progress each month so you can see the fund grow</LI>
          </UL>
          <P>
            If ₹12,500/month is too high, extend the timeline: 18 months → ₹8,333/month. The timeline matters less than
            starting and being consistent.
          </P>

          <H2>What counts as an emergency?</H2>
          <P>
            The hardest part of having an emergency fund is <em>not using it for non-emergencies</em>. Define your rules upfront:
          </P>
          <UL>
            <LI>✅ Medical bills not covered by insurance</LI>
            <LI>✅ Job loss — covering essential expenses while job-hunting</LI>
            <LI>✅ Critical appliance or vehicle failure (fridge breakdown, bike repair needed for work)</LI>
            <LI>✅ Emergency travel for family crisis</LI>
            <LI>❌ Vacation (not an emergency)</LI>
            <LI>❌ Sale purchase (not an emergency)</LI>
            <LI>❌ Phone upgrade (not an emergency)</LI>
          </UL>
          <P>
            When you do use the fund for a genuine emergency, rebuild it before working on any other savings goals.
          </P>

          <H2>Track your emergency fund with Gullak.Online</H2>
          <P>
            Create a gullak named &quot;Emergency Fund&quot;, set your target (e.g. ₹1,50,000) and target date, and let
            Gullak.Online calculate exactly how much to save each month. Log deposits as you make them, and watch your safety
            net grow — one month at a time.
          </P>
          <CTA />
        </>
      );
    },
  },

  {
    slug: "goal-based-savings-india",
    title: "Goal-Based Savings: The Smartest Way to Save Money in India",
    description:
      "Goal-based savings means saving for a specific purpose with a clear target and timeline. Learn why it works, how to set savings goals in India, and how to calculate your monthly contribution.",
    date: "May 12, 2026",
    dateISO: "2026-05-12",
    readTime: "6 min read",
    keywords: [
      "goal based savings India",
      "savings goals India",
      "how to set savings goals",
      "monthly savings goal calculator",
      "savings plan India",
      "financial goals India 2026",
    ],
    Content() {
      return (
        <>
          <P>
            Most people save money in one big pile — all their savings in a single bank account with no clear purpose. When
            they need money, they take from that pile. When the pile is gone, they&apos;ve &quot;spent their savings&quot; but
            can&apos;t quite remember on what.
          </P>
          <P>
            <strong>Goal-based savings</strong> is the opposite: every rupee you save is earmarked for a specific purpose, with
            a target amount and a target date. Instead of one vague savings pile, you have multiple focused buckets — one for
            your Europe trip, one for a new laptop, one for your emergency fund, one for your sister&apos;s wedding gift.
          </P>
          <P>
            This approach works dramatically better. Here&apos;s why.
          </P>

          <H2>Why goal-based savings outperforms generic saving</H2>
          <UL>
            <LI>
              <strong>Motivation stays high.</strong> When you save toward a specific goal (Goa trip in December), every
              deposit feels meaningful. When you save toward &quot;savings,&quot; every deposit feels abstract.
            </LI>
            <LI>
              <strong>You know exactly how much to save each month.</strong> If your goal is ₹80,000 in 8 months, you need
              ₹10,000/month. That&apos;s a number you can budget for.
            </LI>
            <LI>
              <strong>You spend guilt-free when you reach the goal.</strong> Because the money was set aside intentionally,
              spending it feels earned — not like breaking your savings.
            </LI>
            <LI>
              <strong>You stop raiding one goal to fund another.</strong> Separate buckets create psychological barriers that
              prevent accidental cross-spending.
            </LI>
          </UL>

          <H2>Popular savings goals for Indians in 2026</H2>
          <UL>
            <LI><strong>Emergency fund</strong> — 3–6 months of essential expenses (always build this first)</LI>
            <LI><strong>Vacation</strong> — domestic or international trip fund</LI>
            <LI><strong>Gadget or appliance</strong> — new phone, laptop, AC, washing machine</LI>
            <LI><strong>Wedding expenses</strong> — your own, a sibling&apos;s, or contribution to a family wedding</LI>
            <LI><strong>Home down payment</strong> — building toward the 20% down payment for a flat</LI>
            <LI><strong>Education</strong> — course fees, certification, postgraduate programme</LI>
            <LI><strong>Vehicle</strong> — two-wheeler or car down payment</LI>
            <LI><strong>Festival shopping</strong> — Diwali, Eid, Christmas, or Pongal budget</LI>
            <LI><strong>Home renovation</strong> — painting, new furniture, kitchen remodel</LI>
          </UL>

          <H2>How to set a savings goal: the 3-step formula</H2>
          <P>
            Setting a proper savings goal takes 3 pieces of information:
          </P>
          <UL>
            <LI><strong>Target amount (₹)</strong> — how much do you need? Research actual costs, not guesses.</LI>
            <LI><strong>Target date</strong> — when do you need the money by?</LI>
            <LI><strong>Starting amount (₹)</strong> — how much have you already saved toward this goal?</LI>
          </UL>
          <P>
            Once you have these three, the math is simple:
          </P>
          <P>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-700">
              Monthly contribution = (Target amount − Already saved) ÷ Months remaining
            </code>
          </P>
          <P>
            <strong>Example:</strong> You want ₹90,000 for a trip to Thailand in 9 months and have ₹9,000 already saved.
            Remaining: ₹81,000 ÷ 9 months = <strong>₹9,000/month</strong>.
          </P>

          <H2>What if I can&apos;t afford the monthly amount?</H2>
          <P>
            Two options:
          </P>
          <UL>
            <LI><strong>Extend the timeline</strong> — push the target date back to reduce the monthly amount</LI>
            <LI><strong>Reduce the target</strong> — consider a smaller version of the goal (domestic trip instead of international)</LI>
          </UL>
          <P>
            Never borrow to fund a discretionary goal. If the math doesn&apos;t work at your current income, the goal needs to
            change — not your credit card limit.
          </P>

          <H2>Prioritising multiple savings goals</H2>
          <P>
            When you have several goals competing for the same rupees, prioritise in this order:
          </P>
          <UL>
            <LI><strong>1. Emergency fund</strong> — non-negotiable, always first</LI>
            <LI><strong>2. High-interest debt repayment</strong> — credit card debt at 36–42% p.a. is a financial emergency</LI>
            <LI><strong>3. Time-sensitive goals</strong> — wedding in 6 months beats a vacation in 2 years</LI>
            <LI><strong>4. Longer-horizon goals</strong> — home down payment, education fund</LI>
          </UL>
          <P>
            It&apos;s fine to contribute to multiple goals simultaneously once your emergency fund is complete — just make sure
            the total monthly commitment across all goals fits your budget.
          </P>

          <H2>Tracking your progress keeps you accountable</H2>
          <P>
            The biggest risk with goal-based savings is losing track and losing motivation. Log every deposit, every withdrawal.
            Review your progress monthly. Seeing a progress bar move from 10% to 20% to 50% is genuinely motivating — it creates
            a feedback loop that makes saving feel rewarding instead of painful.
          </P>
          <P>
            This is exactly what Gullak.Online is built for: create your goal, set your target, plan your monthly contributions,
            and watch your animated gullak fill up as you save.
          </P>
          <CTA />
        </>
      );
    },
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
