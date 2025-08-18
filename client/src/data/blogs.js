export const blogs = [
  {
    id: 1,
    title: "Pivoting Shells: From Foothold to Root",
    date: "2025-01-15",
    tags: ["linux", "privesc", "ctf"],
    excerpt: "Checklist for Linux privilege escalation in CTFs.",
    content: `
# Pivoting Shells: From Foothold to Root

1. Enumerate sudo rights
2. Check SUID binaries
3. PATH hijacking opportunities
4. Cron job abuse
5. Kernel exploit checks (last resort)

Notes:
- Document everything you touch.
- Prefer living-off-the-land techniques first.`
  },
  {
    id: 2,
    title: "Tamper-Resistant Logging",
    date: "2025-02-01",
    tags: ["blue-team", "dfir"],
    excerpt: "Hash chains + off-host shipping for IR-friendly logs.",
    content: `
# Tamper-Resistant Logging

- Hash-chain integrity
- Forward logs off-host
- Immutable bucket + retention
- Time sync matters

Good logs save investigations.`
  }
];
