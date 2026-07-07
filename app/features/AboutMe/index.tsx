import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import Section from "~/shared/Section";
import TechBadge from "~/shared/TechBadge";
import type { Experience } from "./types";
import { experiences, frontEndTechs, backEndTechs, courses, toolsTechs } from "./data";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="
        mb-5
        text-lg
        font-semibold
        text-on-surface
        sm:text-xl
      "
    >
      {children}
    </h2>
  );
}

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border-subtle/10
        bg-surface-elevated/40
        p-5
        sm:p-6
        backdrop-blur-sm
        transition-all
        duration-300
        hover:border-border-subtle/20
        hover:shadow-lg
        hover:shadow-accent/10
      "
    >
      {children}
    </div>
  );
}

function ExperienceCard({ company, role, startDate, endDate, activities }: Experience) {
  return (
    <div
      className="
        relative
        border-l-2
        border-border-subtle/20
        pl-6
        sm:pl-8
      "
    >
      <div
        className="
          absolute
          -left-[9px]
          top-2
          h-4
          w-4
          rounded-full
          border-2
          border-surface
          bg-accent-hover
        "
      />

      <div className="mb-4">
        <h3
          className="
            text-base
            font-semibold
            text-on-surface
            sm:text-lg
          "
        >
          {company}
        </h3>

        <p className="font-medium text-accent-hover">{role}</p>

        <p className="mt-1 text-sm font-medium text-muted">
          {startDate} • {endDate}
        </p>
      </div>

      <ul className="space-y-3">
        {activities.map((activity) => (
          <li
            key={activity}
            className="
              text-sm
              leading-relaxed
              font-medium
              text-muted
            "
          >
            • {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutMe() {
  const { t } = useTranslation();

  return (
    <section
      id="aboutme"
      className="
        relative
        overflow-hidden
        min-h-screen
        bg-surface
        px-4
        py-16
        sm:px-6
        sm:py-20
        lg:px-8
        lg:py-24
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-0
            top-32
            h-80
            w-80
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-20
            right-0
            h-96
            w-96
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-12 sm:mb-16">
          <Section
            align="left"
            eyebrow={t("about.eyebrow")}
            title={t("about.title")}
            subtitle={t("about.subtitle")}
          />
        </div>

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >
          <InfoCard>
            <SectionTitle>{t("about.education.heading")}</SectionTitle>

            <div className="space-y-2">
              <p className="font-bold text-accent-hover">{t("about.education.degree")}</p>

              <p className="font-medium text-muted">{t("about.education.institution")}</p>

              <p className="font-medium text-muted">{t("about.education.completion")}</p>
            </div>
          </InfoCard>

          <InfoCard>
            <SectionTitle>{t("about.languages.heading")}</SectionTitle>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-accent-hover">{t("about.languages.english")}</p>

                <p className="text-muted">{t("about.languages.englishLevel")}</p>
              </div>

              <div>
                <p className="font-medium text-accent-hover">{t("about.languages.portuguese")}</p>

                <p className="text-muted">{t("about.languages.portugueseLevel")}</p>
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="mb-6">
          <InfoCard>
            <SectionTitle>{t("about.experience.heading")}</SectionTitle>

            <div className="space-y-10">
              {experiences.map((experience) => {
                const role = t(`about.experiences.${experience.id}.role`);
                const startDate = t(`about.experiences.${experience.id}.startDate`);
                const endDate = t(`about.experiences.${experience.id}.endDate`);
                const activities = t(`about.experiences.${experience.id}.activities`, {
                  returnObjects: true,
                }) as string[];

                return (
                  <ExperienceCard
                    key={experience.id}
                    company={experience.company}
                    role={role}
                    startDate={startDate}
                    endDate={endDate}
                    activities={activities}
                  />
                );
              })}
            </div>
          </InfoCard>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >
          <InfoCard>
            <SectionTitle>{t("about.technologies.heading")}</SectionTitle>
            <p className="font-medium text-accent-hover m-4">{t("about.technologies.frontend")}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {frontEndTechs.map(({ icon, name }) => (
                <TechBadge key={name} Icon={icon} name={name} />
              ))}
            </div>
            <p className="font-medium text-accent-hover m-4">{t("about.technologies.backend")}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {backEndTechs.map(({ icon, name }) => (
                <TechBadge key={name} Icon={icon} name={name} />
              ))}
            </div>
            <p className="font-medium text-accent-hover m-4">{t("about.technologies.tools")}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {toolsTechs.map(({ icon, name }) => (
                <TechBadge key={name} Icon={icon} name={name} />
              ))}
            </div>
          </InfoCard>

          <InfoCard>
            <SectionTitle>{t("about.courses.heading")}</SectionTitle>

            <div className="space-y-4">
              {courses.map((course) => {
                const name = t(`about.courses.${course.id}.name`);
                const conclusionYear = t(`about.courses.${course.id}.conclusionYear`);

                return (
                  <div
                    key={course.id}
                    className="
                      rounded-lg
                      border
                      border-border-subtle/10
                      bg-surface/50
                      p-4
                      transition-all
                      duration-300
                      hover:border-border-subtle/30
                      hover:bg-surface-elevated/70
                    "
                  >
                    <h3 className="font-medium text-on-surface">{name}</h3>

                    <div
                      className="
                        mt-2
                        flex
                        flex-col
                        gap-1
                        text-sm
                        font-medium
                        text-muted
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      <span>{course.institution}</span>
                      <span>{conclusionYear}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}
