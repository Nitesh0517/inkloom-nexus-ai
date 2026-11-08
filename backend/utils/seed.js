require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const BrandProfile = require('../models/BrandProfile');
const ContentReview = require('../models/ContentReview');
const Approval = require('../models/Approval');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inkloom';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB for seeding');
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old collections...');
    await User.deleteMany({});
    await BrandProfile.deleteMany({});
    await ContentReview.deleteMany({});
    await Approval.deleteMany({});

    console.log('Seeding Users...');
    const complianceOfficer = await User.create({
      name: 'Sarah Chen',
      email: 'compliance.officer@inkloom.ai',
      role: 'compliance_officer',
      organization: 'Inkloom Global Technologies',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const brandManager = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.vance@inkloom.ai',
      role: 'brand_manager',
      organization: 'Inkloom Global Technologies',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    console.log('Seeding Brand Profiles...');
    const auraHealth = await BrandProfile.create({
      ownerId: brandManager._id,
      name: 'AuraHealth Systems',
      tagline: 'Precision Care. Unwavering Trust.',
      description: 'Enterprise clinical communication and digital therapeutics platform for global healthcare providers.',
      industry: 'Healthcare & Life Sciences',
      mission: 'Empowering clinical teams with compliant, patient-centric communication that saves lives and preserves privacy.',
      brandVoice: {
        tone: ['Compassionate', 'Clinically Rigorous', 'Authoritative', 'Accessible'],
        formality: 'Semi-Formal',
        dos: [
          'Cite clinical evidence and verified regulatory approvals',
          'Use clear, patient-respectful language',
          'Emphasize HIPAA and SOC2 Type II compliance',
        ],
        donts: [
          'Never promise "guaranteed medical cures" or unconditional outcomes',
          'Avoid sensational or fear-inducing medical jargon',
          'Never refer to patients as "users" or "consumers" in clinical contexts',
        ],
        readingLevel: 'Grade 9-11 (Accessible Healthcare Professional)',
      },
      targetAudience: 'Chief Medical Officers, Hospital Administrators, and Clinical Directors.',
      preferredTerms: [
        { term: 'Patients', replacementFor: 'Users', context: 'Clinical care settings' },
        { term: 'Clinical-Grade Security', replacementFor: 'Unbreakable Security', context: 'Data encryption claims' },
        { term: 'Validated Diagnostic Support', replacementFor: 'AI Doctor', context: 'Software capabilities' },
        { term: 'Care Coordination Hub', replacementFor: 'Chat Tool', context: 'Product naming' },
      ],
      restrictedTerms: [
        { term: '100% cure rate', reason: 'False and legally prohibited medical claim', severity: 'Critical' },
        { term: 'AI Doctor', reason: 'Misrepresents software as licensed medical practitioner', severity: 'Critical' },
        { term: 'Cheat the system', reason: 'Unethical phrasing contradictory to clinical governance', severity: 'Critical' },
        { term: 'Cheap', reason: 'Brand positions as enterprise high-reliability, use "Cost-effective"', severity: 'Warning' },
      ],
      approvedFacts: [
        {
          fact: 'AuraHealth operates with SOC2 Type II and HIPAA compliance certified by Schellman.',
          category: 'Compliance & Security',
          source: '2025 Annual Trust & Security Report',
        },
        {
          fact: 'Platform maintains a 99.99% uptime SLA across 42 hospitals nationwide.',
          category: 'Infrastructure',
          source: 'Enterprise SLA Documentation v4',
        },
        {
          fact: 'AuraHealth reduces patient discharge communication delays by an average of 34%.',
          category: 'Clinical Outcome',
          source: 'Journal of Health Informatics Study 2024',
        },
      ],
      prohibitedClaims: [
        {
          claim: 'Guaranteed 100% cure for cardiovascular distress',
          reason: 'Regulatory FDA warning violation',
          severity: 'Critical',
        },
        {
          claim: 'Replaces human physicians entirely',
          reason: 'Prohibited by medical board governance guidelines',
          severity: 'Critical',
        },
        {
          claim: 'Completely immune to any security cyber threat',
          reason: 'Misleading cybersecurity warranty disclaimer violation',
          severity: 'Critical',
        },
      ],
      guidelines: [
        {
          title: 'AuraHealth Global Voice & Clinical Editorial Standards 2025',
          fileType: 'pdf',
          fileUrl: '/uploads/guidelines-aurahealth.pdf',
          extractedText: 'AuraHealth communications must uphold absolute clinical fidelity. Always specify that our software acts as a decision-support copilot, never an autonomous physician. Terms such as AI Doctor are strictly forbidden. All outcome metrics must refer back to peer-reviewed studies.',
          uploadedAt: new Date(),
        },
      ],
      assets: [
        {
          name: 'AuraHealth Primary Vector Logo',
          type: 'logo',
          url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100',
          description: 'Official deep navy and medical cyan primary emblem.',
        },
      ],
    });

    const finPulse = await BrandProfile.create({
      ownerId: brandManager._id,
      name: 'FinPulse Core',
      tagline: 'Autonomous Treasury Infrastructure',
      description: 'Next-generation financial operations and liquidity routing engine for Fortune 500 treasuries.',
      industry: 'FinTech & Banking',
      mission: 'Enabling real-time liquidity reconciliation with bank-grade governance and zero-tolerance precision.',
      brandVoice: {
        tone: ['Precise', 'Institutional', 'Transparent', 'Analytical'],
        formality: 'Formal',
        dos: [
          'Use precise financial terms (e.g., basis points, liquidity tiering)',
          'Always include FDIC pass-through deposit disclosures',
          'Maintain calm, sober institutional authority',
        ],
        donts: [
          'Do not use crypto slang like "to the moon" or hype rhetoric',
          'Never promise risk-free yields or guaranteed returns',
          'Avoid calling deposits "risk-free" without disclosure',
        ],
        readingLevel: 'Executive Corporate (CFO, Treasurer)',
      },
      targetAudience: 'Chief Financial Officers, Corporate Treasurers, and Head of Risk.',
      preferredTerms: [
        { term: 'Automated Treasury Protocol', replacementFor: 'Crypto Bot', context: 'System terminology' },
        { term: 'Yield Optimization', replacementFor: 'Get Rich Quick', context: 'Return strategies' },
        { term: 'Capital Preservation', replacementFor: 'Free Money', context: 'Asset security' },
      ],
      restrictedTerms: [
        { term: 'Guaranteed 25% return', reason: 'SEC and FTC deceptive yield claim violation', severity: 'Critical' },
        { term: 'Zero risk', reason: 'FINRA violation without statutory risk disclosure', severity: 'Critical' },
        { term: 'Mooning', reason: 'Colloquial hype incompatible with institutional banking', severity: 'Warning' },
      ],
      approvedFacts: [
        {
          fact: 'FinPulse routes over $14.2B in annualized transaction volume across 12 tier-one partner banks.',
          category: 'Scale',
          source: 'Q3 Financial Disclosures 2025',
        },
        {
          fact: 'Deposits are eligible for up to $2.5M in FDIC insurance coverage through program sweep banks.',
          category: 'Insurance & Safety',
          source: 'FinPulse Deposit Sweep Agreement',
        },
      ],
      prohibitedClaims: [
        {
          claim: 'Guaranteed doubling of treasury yield with zero market volatility',
          reason: 'Securities act misrepresentation',
          severity: 'Critical',
        },
      ],
      guidelines: [
        {
          title: 'FinPulse Institutional Messaging and Disclosure Guide',
          fileType: 'docx',
          fileUrl: '/uploads/guidelines-finpulse.docx',
          extractedText: 'Corporate treasury requires sober, audit-ready language. Always state that yields are variable and subject to market rates. Prohibit any promotional hyperbole.',
          uploadedAt: new Date(),
        },
      ],
    });

    console.log('Seeding Content Reviews...');
    const review1 = await ContentReview.create({
      userId: brandManager._id,
      brandId: auraHealth._id,
      title: 'Q1 Patient Portal Launch Announcement',
      contentType: 'Marketing Emails',
      originalContent: `Hey folks! We are super pumped to unveil our brand new AI Doctor feature inside the AuraHealth app!!! Our AI Doctor has an incredible 100% cure rate for common illnesses and will completely replace boring doctor visits. Try our cheap new plan today to cheat the system and get instant medical fixes!`,
      improvedContent: `We are pleased to introduce the validated Clinical Decision Support module within AuraHealth Systems. Engineered in strict compliance with HIPAA and SOC2 standards, this new capability assists licensed practitioners in accelerating triage workflows by up to 34%. Explore our cost-effective enterprise tier today to streamline clinical care coordination.`,
      consistencyScore: 38,
      summary: 'Critical brand violations detected: unauthorized claims ("100% cure rate"), prohibited nomenclature ("AI Doctor"), unprofessional colloquialisms ("pumped", "cheap"), and unethical phrasing.',
      findings: [
        {
          category: 'Factual Accuracy',
          severity: 'Critical',
          issue: 'Prohibited medical claim: "100% cure rate"',
          originalText: '100% cure rate for common illnesses',
          explanation: 'Violates AuraHealth clinical guideline prohibiting absolute outcome guarantees and triggers FDA false advertising violation.',
          guidelineReference: 'Approved Claims Protocol & Clinical Standards',
          sourceReference: 'AuraHealth Global Voice & Clinical Editorial Standards 2025',
          suggestedCorrection: 'assisted diagnostic support with clinically validated outcomes',
          verificationStatus: 'Requires Human Verification',
          isApplied: true,
        },
        {
          category: 'Terminology Compliance',
          severity: 'Critical',
          issue: 'Restricted term: "AI Doctor"',
          originalText: 'AI Doctor',
          explanation: 'Misrepresents decision support software as an autonomous licensed medical practitioner.',
          guidelineReference: 'Brand Nomenclature Guide',
          sourceReference: 'Brand Voice & Style Guide',
          suggestedCorrection: 'Clinical Decision Support module',
          verificationStatus: 'Needs Review',
          isApplied: true,
        },
        {
          category: 'Brand Messaging',
          severity: 'Critical',
          issue: 'Ethical governance violation: "cheat the system"',
          originalText: 'cheat the system',
          explanation: 'Contradicts AuraHealth mission statement of building unwavering trust and ethical patient care.',
          guidelineReference: 'Core Brand Values & Code of Ethics',
          sourceReference: 'AuraHealth Trust Policy',
          suggestedCorrection: 'streamline clinical care coordination',
          verificationStatus: 'Needs Review',
          isApplied: true,
        },
        {
          category: 'Tone Consistency',
          severity: 'Warning',
          issue: 'Excessive punctuation and hyper-informal salutation',
          originalText: 'Hey folks! ... app!!!',
          explanation: 'Informal hype language diverges from the semi-formal, compassionate, and authoritative brand voice.',
          guidelineReference: 'Tone of Voice Guide (Accessible Healthcare Professional)',
          sourceReference: 'AuraHealth Style Standards',
          suggestedCorrection: 'We are pleased to introduce...',
          verificationStatus: 'Needs Review',
          isApplied: true,
        },
        {
          category: 'Terminology Compliance',
          severity: 'Suggestion',
          issue: 'Non-preferred brand term: "cheap"',
          originalText: 'cheap',
          explanation: 'Brand positions as enterprise high-reliability. Recommended preferred term is "cost-effective".',
          guidelineReference: 'Enterprise Positioning Guide',
          sourceReference: 'Brand Guidelines',
          suggestedCorrection: 'cost-effective',
          verificationStatus: 'Needs Review',
          isApplied: true,
        },
      ],
      passedChecks: [
        { rule: 'Grammar and Syntax', details: 'Basic grammatical structure conforms to readable English.' },
      ],
      warnings: [
        'Content contains 3 critical regulatory violations requiring complete rewrite before legal review.',
      ],
      status: 'Changes Requested',
      reviewerNotes: 'Content cannot be approved in its current form due to FDA claim violations. Please apply the AI suggested corrections and re-submit.',
      reviewedBy: complianceOfficer._id,
      reviewedAt: new Date(Date.now() - 3600000 * 2),
      metadata: {
        wordCount: 46,
        readingTimeMinutes: 1,
        analyzedWithModel: 'Gemini 2.5 Flash / Inkloom Engine',
      },
    });

    const review2 = await ContentReview.create({
      userId: brandManager._id,
      brandId: finPulse._id,
      title: 'Treasury Liquidity Orchestration Whitepaper Executive Summary',
      contentType: 'Blog Content',
      originalContent: `Corporate treasurers face unprecedented complexity managing multi-entity capital positions. FinPulse Core provides automated treasury infrastructure routing transactions across twelve tier-one partner banks. With continuous reconciliation and bank-grade governance, enterprise finance teams maintain capital preservation while optimizing liquid yields.`,
      improvedContent: `Corporate treasurers face unprecedented complexity managing multi-entity capital positions. FinPulse Core provides automated treasury infrastructure routing transactions across twelve tier-one partner banks. With continuous reconciliation and bank-grade governance, enterprise finance teams maintain capital preservation while optimizing liquid yields. (Deposits eligible for up to $2.5M in FDIC coverage through sweep bank programs).`,
      consistencyScore: 94,
      summary: 'Exceptional alignment with FinPulse institutional brand guidelines, precise financial vocabulary, and verified partner statistics.',
      findings: [
        {
          category: 'Factual Accuracy',
          severity: 'Suggestion',
          issue: 'Missing statutory FDIC sweep bank disclosure',
          originalText: 'optimizing liquid yields.',
          explanation: 'While the text is compliant, adding the approved FDIC insurance disclosure enhances institutional confidence and regulatory compliance.',
          guidelineReference: 'Banking & Financial Product Disclosures v2',
          sourceReference: 'FinPulse Deposit Sweep Agreement',
          suggestedCorrection: 'optimizing liquid yields. (Deposits eligible for up to $2.5M in FDIC coverage through sweep bank programs).',
          verificationStatus: 'Verified Fact',
          isApplied: true,
        },
      ],
      passedChecks: [
        { rule: 'Tone & Formality', details: 'Formality matches executive institutional audience.' },
        { rule: 'Prohibited Claims', details: 'No deceptive yields or volatile crypto claims detected.' },
        { rule: 'Approved Facts', details: 'Partner bank metrics match official Q3 financial disclosures.' },
      ],
      warnings: [],
      status: 'Approved',
      reviewerNotes: 'Excellent work. Tone is sober, authoritative, and perfectly positioned for Fortune 500 treasurers. Statutory disclosure added.',
      reviewedBy: complianceOfficer._id,
      reviewedAt: new Date(Date.now() - 3600000 * 5),
      metadata: {
        wordCount: 42,
        readingTimeMinutes: 1,
        analyzedWithModel: 'Gemini 2.5 Flash / Inkloom Engine',
      },
    });

    const review3 = await ContentReview.create({
      userId: brandManager._id,
      brandId: auraHealth._id,
      title: 'LinkedIn Clinical Case Study: St. Jude Hospital',
      contentType: 'Social Media Posts',
      originalContent: `Thrilled to share how St. Jude Hospital integrated AuraHealth Systems into their surgical workflow, reducing patient discharge communication delays by 34%. Our team works day and night to keep clinical teams connected with clinical-grade security.`,
      improvedContent: `We are proud to share that St. Jude Hospital has integrated AuraHealth Systems into their post-acute workflow, reducing patient discharge communication delays by an average of 34%. Powered by clinical-grade security and SOC2 Type II compliance, AuraHealth continues to support healthcare teams with dependable communication infrastructure.`,
      consistencyScore: 91,
      summary: 'Strong brand alignment. Validated outcome statistic matches published 2024 health informatics study.',
      findings: [
        {
          category: 'Tone Consistency',
          severity: 'Suggestion',
          issue: 'Colloquial verb phrasing: "works day and night"',
          originalText: 'works day and night to keep clinical teams connected',
          explanation: 'Recommended to frame with enterprise reliability and infrastructure stability rather than informal colloquial effort phrases.',
          guidelineReference: 'AuraHealth Global Voice Standards',
          sourceReference: 'Brand Voice Guide',
          suggestedCorrection: 'continues to support healthcare teams with dependable communication infrastructure',
          verificationStatus: 'Needs Review',
          isApplied: false,
        },
      ],
      passedChecks: [
        { rule: 'Verified Fact', details: '34% delay reduction is verified by Journal of Health Informatics 2024.' },
        { rule: 'Preferred Vocabulary', details: 'Correctly used "clinical-grade security".' },
      ],
      warnings: [],
      status: 'Under Review',
      reviewerNotes: '',
      metadata: {
        wordCount: 33,
        readingTimeMinutes: 1,
        analyzedWithModel: 'Gemini 2.5 Flash / Inkloom Engine',
      },
    });

    console.log('Seeding Approvals...');
    await Approval.create({
      reviewId: review1._id,
      reviewerId: complianceOfficer._id,
      reviewerName: complianceOfficer.name,
      decision: 'Changes Requested',
      comments: 'Critical regulatory and factual claims must be resolved before this goes to public marketing channels.',
      versionReviewed: 'Original',
    });

    await Approval.create({
      reviewId: review2._id,
      reviewerId: complianceOfficer._id,
      reviewerName: complianceOfficer.name,
      decision: 'Approved',
      comments: 'Institutional tone is pristine. Complies with all SEC and brand style parameters.',
      versionReviewed: 'AI-Improved',
    });

    console.log('🎉 Database successfully seeded with rich realistic data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
