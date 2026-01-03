"use client";

import React, { useEffect, useState, useRef } from "react";
import getApiClient from "@/lib/api-client";
import LoadingSpinner from "../ui/loading-spinner";
import NoContent from "../NoContent";
import { toast } from "sonner";
import { X } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import * as htmlToImage from "html-to-image";

// ----------------------
// Certificate Interface
// ----------------------
interface Certificate {
  id: string;
  certificateNumber: string;
  finalRank: number;
  totalScore: number;
  completionRate: number;
  status: string;
  issuedAt: string;
  verificationCode: string;
  competition: {
    name: string;
    title: string;
    startDate: string;
    endDate: string;
    admin: {
      username: string;
    }
  };
  user: {
    username: string;
    email: string;
    profile: {
      firstName: string,
      lastName: string,
    }
  };
}

// ----------------------
// Wait for all images
// ----------------------
async function waitForImagesToLoad(container: HTMLElement) {
  const imgs = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

// ----------------------
// Component
// ----------------------


interface CertificatesPageProps {
  competitionId?: string;
}
const CertificatesPage = ({competitionId}: CertificatesPageProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const hiddenCertificateRef = useRef<HTMLDivElement>(null);

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const query = competitionId ? `?competitionId=${competitionId}` : '';
        const res = await getApiClient().get("/certificates/my"+query);
        setCertificates(res.data.certificates);
      } catch (error) {
        toast.error("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // Generate preview when modal opens
  useEffect(() => {
    if (!selectedCert) return;

    const generatePreview = async () => {
      if (!hiddenCertificateRef.current) return;

      try {
        await waitForImagesToLoad(hiddenCertificateRef.current);

        const dataUrl = await htmlToImage.toPng(hiddenCertificateRef.current, {
          backgroundColor: null,
          pixelRatio: 1,
          cacheBust: true,
        });

        setPreviewImage(dataUrl);
      } catch (err) {
        console.error("Preview generation failed:", err);
      }
    };

    generatePreview();
  }, [selectedCert]);

  // ----------------------
  // Download full image
  // ----------------------
  const downloadCertificate = async () => {
    if (!hiddenCertificateRef.current || !selectedCert) return;

    try {
      await waitForImagesToLoad(hiddenCertificateRef.current);

      const dataUrl = await htmlToImage.toPng(hiddenCertificateRef.current, {
        backgroundColor: null,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${selectedCert.certificateNumber}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download certificate");
    }
  };

  // ----------------------
  // Loading State
  // ----------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  // ----------------------
  // No Certs
  // ----------------------
  if (!certificates.length) {
    return (
      <NoContent
        title="No certificates yet"
        description="You haven't earned any certificates yet. Participate in competitions to earn them!"
      />
    );
  }

  // ----------------------
  // MAIN UI
  // ----------------------
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">My Certificates</h1>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-slate-800 
            text-white rounded-xl relative overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setSelectedCert(cert)}
          >
            
      <img src="/costume1.svg" className="absolute w-[150px] rotate-[-130deg] right-[-50px] top-[-5px]" />
        <img src="/h2.png" className="w-[50px] drop-shadow-lg right-5 top-5 mx-auto mb-4 absolute" />
            <div className="p-5">
              <h2 className="text-xl font-semibold">{cert.competition.title}</h2>
              <p className="text-sm mt-1 text-indigo-200">{cert.competition.name}</p>

              <p className="mt-3 text-sm">Rank: {cert.finalRank}</p>
              <p className="text-sm">Score: {cert.totalScore}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------
            Modal
      ---------------------- */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-3xl p-6 shadow-2xl relative">

            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              onClick={() => setSelectedCert(null)}
            >
              <X size={28} />
            </button>

            {/* PREVIEW */}
            <div className="mt-8 flex justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="rounded-xl w-full max-h-[500px] object-contain"
                />
              ) : (
                <p className="text-white">Generating preview...</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={downloadCertificate}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------
          Hidden certificate DOM
          Needed for image generation
      ---------------------- */}
      {selectedCert && (
        <div
          ref={hiddenCertificateRef}
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <CertificateTemplate cert={selectedCert} />
        </div>
      )}
    </div>
  );
};

// ----------------------
// Certificate Template
// ----------------------
const CertificateTemplate = ({ cert }: { cert: Certificate }) => {
  return (
    <div className="w-[2200px] h-[1100px] bg-slate-900 overflow-hidden px-20 py-10 flex flex-col justify-between relative">

      <img src="/costume1.svg" className="absolute rotate-[130deg] left-[-200px] top-[-40px]" />
      <img src="/costume1.svg" className="absolute rotate-[-130deg] right-[-200px] top-[-40px]" />

      <div className="text-center pt-10">
        <img src="/h2.png" className="w-[150px] mx-auto mb-4" />
        <h1 className="text-5xl text-white font-semibold">Oprix CTF Competitions</h1>
        <h1 className="text-8xl font-extrabold text-white mt-2">Certificate of Completion</h1>
      </div>

      <div className="text-center mt-8">
        <p className="text-2xl text-slate-300">This certificate is awarded to</p>

        <p className="text-7xl font-light text-white mt-6">{cert.user.profile.firstName + ' ' + cert.user.profile.lastName}</p>

        <hr className="border-slate-500 w-[30%] mx-auto my-4" />

        <p className="w-[70%] mx-auto text-2xl text-slate-300">
          Dedication and skill pave the way to achievement. This certificate recognizes<br />
          the journey of dedication and hard work celebrated here.
        </p>
      </div>

      <div className="w-full mt-10 text-2xl flex justify-between items-center px-10">

        <div>
          <h1 className="text-xl text-white font-semibold">Organiser</h1>
          <p className="text-slate-400">{cert.competition.admin.username}</p>
          <img src="/h3.png" className="w-[150px] invert brightness-0 mt-2" />
        </div>

        <div className="flex gap-6 items-center">
          <QRCode value={cert.verificationCode} size={150} bgColor="transparent" fgColor="#fff" />
          
          <img src="/h1.png" className="w-[200px]" />
          <img src="/img/logo2.png" className="w-[100px]" />
        </div>

        <div className="text-right">
          <h1 className="text-xl text-white font-semibold">Date</h1>
          <p className="text-slate-400">
            {new Date(cert.issuedAt).toLocaleDateString()}
          </p>
          <p className="text-slate-400">CODE: {cert.verificationCode}</p>
        </div>
      </div>

    </div>
  );
};

export default CertificatesPage;
