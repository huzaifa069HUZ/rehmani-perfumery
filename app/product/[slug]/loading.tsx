import Image from 'next/image';

export default function Loading() {
  return (
    <div className="pp-page skeleton-page">
      <div className="pp-breadcrumb" style={{ margin: '20px 0' }}>
        <div className="skeleton-box" style={{ width: '200px', height: '14px', borderRadius: '4px' }}></div>
      </div>

      <div className="pp-layout" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div className="pp-gallery" style={{ flex: '1 1 500px' }}>
          <div className="pp-main-img skeleton-box" style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', overflow: 'hidden' }}>
             {/* Beautiful Logo Pulse */}
             <div className="pulse-logo-wrap" style={{ position: 'relative' }}>
               <div className="pulse-glow"></div>
               <Image src="/logo.png" alt="Loading..." width={100} height={100} className="pulse-logo" priority />
             </div>
          </div>
          <div className="pp-thumbs" style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
             <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '4px' }}></div>
             <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '4px' }}></div>
             <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '4px' }}></div>
          </div>
        </div>

        <div className="pp-info" style={{ flex: '1 1 400px', paddingTop: '10px' }}>
          <div className="skeleton-box" style={{ width: '120px', height: '16px', marginBottom: '12px', borderRadius: '4px' }}></div>
          <div className="skeleton-box" style={{ width: '80%', height: '36px', marginBottom: '24px', borderRadius: '4px' }}></div>
          <div className="skeleton-box" style={{ width: '150px', height: '24px', marginBottom: '32px', borderRadius: '4px' }}></div>
          
          <div className="skeleton-box" style={{ width: '60px', height: '16px', marginBottom: '12px', borderRadius: '4px' }}></div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
            <div className="skeleton-box" style={{ width: '60px', height: '40px', borderRadius: '6px' }}></div>
            <div className="skeleton-box" style={{ width: '60px', height: '40px', borderRadius: '6px' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            <div className="skeleton-box" style={{ flex: 1, height: '54px', borderRadius: '30px' }}></div>
            <div className="skeleton-box" style={{ flex: 1, height: '54px', borderRadius: '30px' }}></div>
          </div>
          
          <div className="skeleton-box" style={{ width: '100%', height: '14px', marginBottom: '16px', borderRadius: '4px' }}></div>
          <div className="skeleton-box" style={{ width: '100%', height: '14px', marginBottom: '16px', borderRadius: '4px' }}></div>
          <div className="skeleton-box" style={{ width: '80%', height: '14px', marginBottom: '32px', borderRadius: '4px' }}></div>

          <div className="skeleton-box" style={{ width: '100%', height: '60px', marginBottom: '16px', borderRadius: '4px' }}></div>
          <div className="skeleton-box" style={{ width: '100%', height: '60px', marginBottom: '16px', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
}
