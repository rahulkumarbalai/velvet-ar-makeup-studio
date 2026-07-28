import React from 'react';

export const GuideCards: React.FC = () => {
  return (
    <div>
      <div className="section-title" style={{ marginBottom: '12px' }}>
        <span>📖 Studio & Touchless Guide</span>
      </div>
      <div className="guides-grid">
        <div className="guide-card">
          <div className="step-number">1</div>
          <div className="step-info">
            <h4>Pinch to Reveal & Scale</h4>
            <p>Pinch your thumb and index fingers together to reveal your luxury virtual bullet, automatically scaled to your finger span.</p>
          </div>
        </div>
        <div className="guide-card">
          <div className="step-number">2</div>
          <div className="step-info">
            <h4>Full-Face Makeover</h4>
            <p>Guide the lipstick tip to your mouth to instantly apply lip color, rosy airbrushed blush, and sleek eyeliner.</p>
          </div>
        </div>
        <div className="guide-card">
          <div className="step-number">3</div>
          <div className="step-info">
            <h4>Snap & Compare</h4>
            <p>Use the mobile-friendly floating suite to compare Before/After views and instantly download a high-res selfie!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
