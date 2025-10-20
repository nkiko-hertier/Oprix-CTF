function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="flex justify-center items-center h-screen overflow-y-auto">
            {children}
        </div>
    </>
  );
}

export default layout;
