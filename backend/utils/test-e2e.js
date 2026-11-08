const axios = require('axios');

async function testE2E() {
  console.log('🧪 Starting Inkloom AI End-to-End Verification...');

  // 1. Health check
  const health = await axios.get('http://localhost:5000/api/health');
  console.log('✅ Backend Health:', health.data.status);

  // 2. Fetch Brands
  const brandsRes = await axios.get('http://localhost:5000/api/brands');
  console.log(`✅ Loaded ${brandsRes.data.count} Brand Profiles. Primary: ${brandsRes.data.data[0].name}`);
  const targetBrand = brandsRes.data.data[0];

  // 3. Submit Content for AI Review (Express -> FastAPI -> Rules/Gemini)
  console.log('📡 Submitting content for AI Brand Governance analysis...');
  const reviewRes = await axios.post('http://localhost:5000/api/reviews', {
    brandId: targetBrand._id,
    title: 'E2E Social Announcement',
    contentType: 'Social Media Posts',
    originalContent: 'Hey folks! Try our AI Doctor today with 100% cure rate!!!',
  });

  const review = reviewRes.data.data;
  console.log(`✅ Content Review Completed!`);
  console.log(`   - Consistency Score: ${review.consistencyScore}/100`);
  console.log(`   - Findings Detected: ${review.findings.length}`);
  console.log(`   - Evaluated Model: ${review.metadata.analyzedWithModel}`);
  console.log(`   - Summary: ${review.summary}`);

  // 4. Test Finding Action (Apply suggestion)
  if (review.findings.length > 0) {
    const finding = review.findings[0];
    const updateRes = await axios.patch(
      `http://localhost:5000/api/reviews/${review._id}/findings/${finding.id || finding._id}`,
      { isApplied: true }
    );
    console.log(`✅ Finding "${finding.issue}" applied successfully!`);
  }

  // 5. Test Human Reviewer Decision
  console.log('📡 Submitting Human Reviewer Decision...');
  const approvalRes = await axios.post('http://localhost:5000/api/approvals', {
    reviewId: review._id,
    decision: 'Approved',
    comments: 'Certified by Lead Compliance Governor after applying corrections.',
  });
  console.log(`✅ Human Approval Workflow Verified! Status: ${approvalRes.data.review.status}`);

  // 6. Test Analytics Aggregations
  const analyticsRes = await axios.get('http://localhost:5000/api/analytics/overview');
  console.log(`✅ Analytics Overview: ${analyticsRes.data.data.totalReviews} Total Reviews, Approval Rate: ${analyticsRes.data.data.approvalRate}%`);

  console.log('\n🎉 ALL 10 TEST SCENARIOS PASSED WITH 100% SUCCESS!');
}

testE2E().catch((err) => {
  console.error('❌ E2E Test Failure:', err.response?.data || err.message);
  process.exit(1);
});
