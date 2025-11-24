import { principlesData } from '@/pages/main/learn-triz/components/principles-data';

export const TRIZPrinciplesList = () => {
  return (
    <section className="py-8 bg-slate-50">
      <div className="container mx-auto px-4 my-10">
        <div className="flex flex-col gap-6">
          {principlesData.map((principle) => (
            <div
              key={principle.number}
              className="relative bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden"
            >
              {/* The Green Vertical Bar on the Left */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600" />

              <div className="p-6 pl-8 flex flex-col md:flex-row gap-6">
                {/* Content Column */}
                <div className="flex-1">
                  {/* Header: Number and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xl md:text-xl shadow-sm">
                      {principle.number}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                      {principle.title}
                    </h3>
                  </div>

                  {/* Descriptions and Bullets */}
                  <div className="space-y-6">
                    {principle.content.map((block, idx) => (
                      <div key={idx}>
                        <p className="text-slate-800 text-md md:text-xl font-medium mb-2 leading-relaxed">
                          {block.text}
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {block.examples.map((example, exIdx) => (
                            <li
                              key={exIdx}
                              className="text-slate-600 text-md md:text-lg leading-relaxed"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Column (Right Side) */}
                <div className="w-full md:w-1/4 flex items-start justify-center md:justify-end pt-4">
                  {/* 
                     If you don't have real images yet, this placeholder 
                     mimics the shape in the screenshot.
                  */}
                  <div className=" md:w-[80%]  ">
                    {principle.image &&
                    !principle.image.includes('placehold') ? (
                      <img
                        src={principle.image}
                        alt={principle.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      /* Fallback visual if no image exists */
                      <span className="text-4xl text-slate-300 font-bold">
                        {principle.number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
