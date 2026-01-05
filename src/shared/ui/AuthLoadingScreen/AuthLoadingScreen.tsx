/**
 * AuthLoadingScreen - Beautiful animated loading screen with Click Food logo
 */

export const AuthLoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#cdff03] z-9999 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      {/* Main logo text container */}
      <div className="relative z-10 text-center">
        {/* Click Food animated text */}
        <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-bold text-black m-0 font-sans tracking-tight flex gap-2 justify-center flex-wrap">
          <span className="word inline-flex">
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0s]">
              C
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.1s]">
              l
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.2s]">
              i
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.3s]">
              c
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.4s]">
              k
            </span>
          </span>
          <span className="word inline-flex">
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.5s]">
              F
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.6s]">
              o
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.7s]">
              o
            </span>
            <span className="letter inline-block opacity-0 animate-letter-appear [animation-delay:0.8s]">
              d
            </span>
          </span>
        </h1>

        {/* Pulsing dot indicator */}
        <div className="mt-8 flex gap-2 justify-center">
          <div className="dot [animation-delay:0s]" />
          <div className="dot [animation-delay:0.2s]" />
          <div className="dot [animation-delay:0.4s]" />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        /* Letter animation - fade in and slide up */
        @keyframes letterAppear {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Continuous pulse animation for text */
        @keyframes textPulse {
          0%, 100% {
            transform: scale(1);
            text-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.02);
            text-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
          }
        }

        /* Dot pulse animation */
        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* Background circle animations */
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(0, -40px) scale(1.05);
          }
        }

        /* Apply animations */
        .animate-letter-appear {
          animation: letterAppear 0.6s ease-out forwards, textPulse 2s ease-in-out infinite;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          animation: dotPulse 1.4s ease-in-out infinite;
        }

        .circle {
          position: absolute;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 50%;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
          animation: float2 15s ease-in-out infinite;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float3 18s ease-in-out infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .circle-1 {
            width: 200px;
            height: 200px;
          }
          .circle-2 {
            width: 150px;
            height: 150px;
          }
          .circle-3 {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  )
}
